import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

import AdminJS, { ComponentLoader } from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import AdminJSSequelize from '@adminjs/sequelize'
import uploadFeature from '@adminjs/upload'

import sequelize from './config/db.js'
import Berita from './models/berita.js'
import Keluhan from './models/keluhan.js'
import Antrean from './models/antrean.js'
import Jadwal from './models/jadwal.js'
import { getAdmin } from './auth/admin-user.js'

AdminJS.registerAdapter(AdminJSSequelize)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = 3000

const start = async () => {
  const app = express()
  const ADMIN = await getAdmin()

  app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

  // 🧩 Register custom React components
  const componentLoader = new ComponentLoader()
  const DashboardComponent = componentLoader.add('Dashboard', path.join(__dirname, 'components', 'Dashboard.jsx'))
  const VerifikasiQRComponent = componentLoader.add('VerifikasiQR', path.join(__dirname, 'components', 'VerifikasiQR.jsx'))

  const admin = new AdminJS({
    rootPath: '/admin',
    componentLoader,
    resources: [
      {
        resource: Berita,
        options: {
          properties: {
            isi: { type: 'richtext' },
            gambar: {
              isVisible: { list: true, filter: true, show: true, edit: false, new: false },
            },
            uploadGambar: {
              isVisible: { list: false, filter: false, show: false, edit: true, new: true },
            },
          },
        },
        features: [
          uploadFeature({
            componentLoader,
            provider: {
              local: {
                bucket: path.join(__dirname, 'public/uploads'),
                opts: { baseUrl: '/uploads' },
              },
            },
            properties: {
              key: 'gambar',
              file: 'uploadGambar',
            },
            uploadPath: (record, filename) => `berita-${Date.now()}-${filename}`,
          }),
        ],
      },
      { resource: Keluhan },
      { resource: Antrean },
      { resource: Jadwal },
    ],
    dashboard: {
      handler: async () => {
        const totalKeluhan = await Keluhan.count()
        const totalAntrean = await Antrean.count()
        const totalJadwal = await Jadwal.count()
        const totalBerita = await Berita.count()
        return { totalKeluhan, totalAntrean, totalJadwal, totalBerita }
      },
      component: DashboardComponent,
    },
    pages: {
      VerifikasiQR: {
        label: 'Verifikasi QR',
        component: VerifikasiQRComponent,
      },
    },
  })

  await admin.watch()

  // 🔐 Auth config
  const router = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (email, password) => {
        if (email === ADMIN.email && (await bcrypt.compare(password, ADMIN.password))) {
          return ADMIN
        }
        return null
      },
      cookieName: 'adminjs',
      cookiePassword: 'sessionsecret',
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
    }
  )

  app.use(admin.options.rootPath, router)

  // 📡 Endpoint untuk verifikasi hash dari QR
  app.get('/admin/verifikasi-hash/:hash', async (req, res) => {
    const { hash } = req.params

    try {
      const [result] = await sequelize.query(
        `SELECT p.nik, p.nop, p.alamat, p.luas_tanah, p.njop, p.status_terakhir, p.tahun_terbaru, p.tagihan_terbaru
         FROM hash_verifikasi h
         JOIN pajak_pbb p ON h.nop = p.nop
         WHERE h.hash = :hash`,
        {
          replacements: { hash },
          type: sequelize.QueryTypes.SELECT,
        }
      )

      if (!result) return res.status(404).json({ message: 'Hash tidak ditemukan' })
      return res.json(result)
    } catch (err) {
      console.error('❌ Error verifying hash:', err)
      res.status(500).json({ message: 'Server error' })
    }
  })

  app.listen(PORT, async () => {
    console.log(`✅ AdminJS running at http://localhost:${PORT}/admin`)
    try {
      await sequelize.authenticate()
      await sequelize.sync({ alter: true })
      console.log('✅ Database connected and synced!')
    } catch (err) {
      console.error('❌ DB Error:', err)
    }
  })
}

start()
