import Papa from 'papaparse'

export const extractPrefecture = (address: string): string => {
  const match = address.match(/^.{2,3}(都|道|府|県)/)
  return match ? match[0] : '不明'
}

export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3
  const toRad = (x: number) => (x * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const loadShopsFromCSV = async (): Promise<Shop[]> => {
  const response = await fetch('/shops.csv')
  const csvText = await response.text()

  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const parsed = results.data as any[]
        const shops: Shop[] = parsed
          .filter((row) => row.is_deleted !== 'true')
          .map((row, index) => ({
            id: Number(row.id) || index + 1,
            name: row.name || 'No Data',
            address: row.address || 'No Data',
            price: row.price ? Number(row.price) : 0,
            number_of_machine: row.number_of_machine ? Number(row.number_of_machine) : 0,
            description: row.description || 'No Data',
            lat: row.lat ? Number(row.lat) : 0,
            lng: row.lng ? Number(row.lng) : 0,
            isOpen: false,
          }))

        resolve(shops)
      },
    })
  })
}
