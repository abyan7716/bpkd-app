import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, H2, Text } from '@adminjs/design-system'
import { Html5Qrcode } from 'html5-qrcode'

const VerifikasiQR = () => {
  const [dataPajak, setDataPajak] = useState(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [status, setStatus] = useState('')
  const scannerRef = useRef(null)

  const startCamera = () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("qr-reader")
    }

    setStatus("Mencari QR code...")
    scannerRef.current.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (decodedText) => {
        setStatus("QR Terdeteksi!")

        await scannerRef.current.stop()
        setCameraOn(false)

        try {
          const res = await fetch(`/admin/verifikasi-hash/${decodedText}`)
          if (!res.ok) throw new Error('Hash tidak ditemukan')
          const data = await res.json()
          setDataPajak(data)
        } catch (e) {
          setStatus("QR tidak valid atau hash tidak ditemukan.")
          setDataPajak(null)
        }
      },
      (err) => console.warn('Scan error:', err)
    ).catch(err => {
      setStatus("Gagal mengakses kamera.")
      console.error(err)
    })
  }

  const stopCamera = async () => {
    if (scannerRef.current && cameraOn) {
      try {
        await scannerRef.current.stop()
      } catch (err) {
        console.error("Stop error:", err)
      }
    }
    setCameraOn(false)
  }

  const toggleCamera = async () => {
    if (cameraOn) {
      await stopCamera()
    } else {
      setDataPajak(null)
      setCameraOn(true)
      startCamera()
    }
  }

  const ulangPindai = async () => {
    setDataPajak(null)
    setStatus('')
    await stopCamera()
    setCameraOn(true)
    startCamera()
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <Box variant="grey" p="xxl" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', backgroundColor: '#1e293b', color: '#ffffff', borderRadius: '16px' }}>
      {/* Kolom Scanner */}
      <Box>
        <H2 style={{ color: '#34d399' }}>Verifikasi Data Pajak</H2>
        <Text mb="lg" style={{ color: '#94a3b8' }}>
          Arahkan kamera ke QR code pada laporan pajak.
        </Text>

        <Box id="qr-reader" style={{ width: '100%', maxWidth: '320px', height: '240px', backgroundColor: '#0f172a', borderRadius: '12px' }} />

        {!cameraOn && (
          <Box mt="md" style={{ textAlign: 'center', color: '#64748b' }}>
            <i className="fa-solid fa-video-slash fa-2x" />
            <Text>Kamera tidak aktif</Text>
          </Box>
        )}

        <Box mt="lg" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Text style={{ color: '#cbd5e1' }}>Kamera</Text>
          <label style={{
            width: '56px',
            height: '28px',
            backgroundColor: cameraOn ? '#34d399' : '#334155',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }} onClick={toggleCamera}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#fff',
              borderRadius: '999px',
              transform: cameraOn ? 'translateX(28px)' : 'translateX(0)',
              transition: 'transform 0.3s'
            }} />
          </label>
        </Box>

        <Text mt="lg" style={{ color: '#34d399', minHeight: '24px' }}>{status}</Text>
      </Box>

      {/* Kolom Hasil */}
      <Box style={{ backgroundColor: 'rgba(15,23,42,0.6)', padding: '24px', borderRadius: '12px' }}>
        {!dataPajak ? (
          <Box style={{ textAlign: 'center', color: '#64748b' }}>
            <i className="fa-regular fa-file-lines fa-3x" />
            <Text mt="md">Hasil pindaian akan muncul di sini.</Text>
          </Box>
        ) : (
          <>
            <Box style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Box style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#34d39933',
                borderRadius: '999px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fa-solid fa-check-circle fa-2x" style={{ color: '#34d399' }} />
              </Box>
              <H2 mt="md">Verifikasi Berhasil</H2>
              <Text style={{ color: '#94a3b8' }}>Data Wajib Pajak Ditemukan</Text>
            </Box>

            <Box style={{ fontSize: '14px', lineHeight: '24px' }}>
              <Text><strong>NIK:</strong> {dataPajak.nik}</Text>
              <Text><strong>NOP:</strong> {dataPajak.nop}</Text>
              <Text><strong>Alamat:</strong> {dataPajak.alamat}</Text>
              <Text><strong>Luas Tanah:</strong> {dataPajak.luas_tanah} m²</Text>
              <Text><strong>NJOP:</strong> Rp {dataPajak.njop}</Text>
              <Text><strong>Status:</strong> {dataPajak.status_terakhir}</Text>
              <Text><strong>Tagihan:</strong> Rp {dataPajak.tagihan_terbaru}</Text>
              <Text><strong>Tahun:</strong> {dataPajak.tahun_terbaru}</Text>
            </Box>

            <Button mt="xl" onClick={ulangPindai} variant="primary">
              Pindai Lagi
            </Button>
          </>
        )}
      </Box>
    </Box>
  )
}

export default VerifikasiQR
