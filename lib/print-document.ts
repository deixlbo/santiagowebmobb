interface PrintDocumentOptions {
  title: string
  bodyHtml: string
}

export function printDocument({ title, bodyHtml }: PrintDocumentOptions) {
  const printWindow = window.open('', '', 'width=800,height=600')
  if (!printWindow) {
    alert('Please allow popups to print documents')
    return
  }

  const styles = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Times New Roman', serif;
        font-size: 12pt;
        line-height: 1.6;
        padding: 40px;
        color: #000;
        background: #fff;
      }
      h2 {
        text-align: center;
        font-size: 16pt;
        font-weight: bold;
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      p {
        margin-bottom: 12pt;
        text-align: justify;
      }
      strong {
        font-weight: bold;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 12pt;
      }
      table td {
        padding: 8px;
        vertical-align: top;
      }
      .field {
        font-weight: bold;
      }
      @media print {
        body {
          padding: 0;
        }
        * {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    </style>
  `

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      ${styles}
    </head>
    <body>
      ${bodyHtml}
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()

  setTimeout(() => {
    printWindow.print()
  }, 250)
}
