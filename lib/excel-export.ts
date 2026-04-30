import ExcelJS from 'exceljs'

interface ExcelColumn {
  header: string
  key: string
  width: number
}

interface ExcelExportOptions {
  title: string
  subtitle?: string
  filename: string
  sheetName: string
  columns: ExcelColumn[]
  rows: Record<string, any>[]
}

export async function exportToOfficialExcel({
  title,
  subtitle,
  filename,
  sheetName,
  columns,
  rows,
}: ExcelExportOptions) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)

  // Add title
  worksheet.mergeCells('A1', `${String.fromCharCode(64 + columns.length)}1`)
  const titleCell = worksheet.getCell('A1')
  titleCell.value = title
  titleCell.font = { bold: true, size: 14 }
  titleCell.alignment = { horizontal: 'center', vertical: 'center' }
  worksheet.getRow(1).height = 25

  // Add subtitle if provided
  if (subtitle) {
    worksheet.mergeCells('A2', `${String.fromCharCode(64 + columns.length)}2`)
    const subtitleCell = worksheet.getCell('A2')
    subtitleCell.value = subtitle
    subtitleCell.font = { size: 11, italic: true }
    subtitleCell.alignment = { horizontal: 'center', vertical: 'center' }
    worksheet.getRow(2).height = 20
  }

  // Add empty row
  const headerRowNum = subtitle ? 4 : 3
  worksheet.addRow([])

  // Add headers
  const headerRow = worksheet.addRow(columns.map(col => col.header))
  headerRow.font = { bold: true }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD3D3D3' },
  }
  headerRow.alignment = { horizontal: 'center', vertical: 'center' }

  // Set column widths
  columns.forEach((col, index) => {
    worksheet.getColumn(index + 1).width = col.width
  })

  // Add data rows
  rows.forEach(row => {
    const values = columns.map(col => row[col.key] || '')
    worksheet.addRow(values)
  })

  // Add borders to all cells with content
  const maxRow = worksheet.rowCount
  worksheet.eachRow({ min: 1, max: maxRow }, (row) => {
    row.eachCell({ min: 1, max: columns.length }, (cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
    })
  })

  // Generate buffer and trigger download
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
