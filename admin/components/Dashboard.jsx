import React from 'react'
import { Box, Text } from '@adminjs/design-system'

const Dashboard = ({ totalKeluhan, totalAntrean, totalJadwal, totalBerita }) => (
  <Box variant="grey" p="xl">
    <Text as="h1" variant="h1" mb="md">Selamat datang di Admin Panel BPKD</Text>
    <Text mb="lg">Ringkasan data layanan masyarakat:</Text>

    {/* Grid menggunakan Flexbox */}
    <Box display="flex" flexDirection="row" flexWrap="wrap" gap="xl">
      {/* Card 1: Total Keluhan */}
      <Box variant="white" p="xl" borderRadius="default" flex="1" minWidth="200px">
        <Text variant="lg">📬 Total Keluhan</Text>
        <Text variant="xl" fontWeight="bold">{totalKeluhan}</Text>
      </Box>

      {/* Card 2: Total Antrean */}
      <Box variant="white" p="xl" borderRadius="default" flex="1" minWidth="200px">
        <Text variant="lg">🎟️ Total Antrean</Text>
        <Text variant="xl" fontWeight="bold">{totalAntrean}</Text>
      </Box>

      {/* Card 3: Total Jadwal */}
      <Box variant="white" p="xl" borderRadius="default" flex="1" minWidth="200px">
        <Text variant="lg">📅 Total Jadwal</Text>
        <Text variant="xl" fontWeight="bold">{totalJadwal}</Text>
      </Box>

      {/* Card 4: Total Berita */}
      <Box variant="white" p="xl" borderRadius="default" flex="1" minWidth="200px">
        <Text variant="lg">📰 Total Berita</Text>
        <Text variant="xl" fontWeight="bold">{totalBerita}</Text>
      </Box>
    </Box>
  </Box>
)

export default Dashboard