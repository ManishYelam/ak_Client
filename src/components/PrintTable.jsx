const printTable = () => {
  const printWindow = window.open("", "_blank", "width=800,height=600");
  printWindow.document.write("<html><head><title>Legal Case Documents</title>");
  printWindow.document.write(`
    <style>
      body {
        font-family: 'Times New Roman', serif;
        margin: 20px;
        line-height: 1.5;
      }
      h1, h2 {
        text-align: center;
        margin-bottom: 20px;
      }
      .case-header {
        font-size: 16px;
        font-weight: bold;
        margin-top: 30px;
      }
      .case-section {
        margin-bottom: 20px;
        padding-left: 20px;
      }
      .case-detail {
        margin-left: 40px;
        margin-bottom: 10px;
      }
      .case-detail span {
        font-weight: bold;
      }
      .footer {
        margin-top: 50px;
        text-align: center;
        font-size: 12px;
        font-style: italic;
      }
      @media print {
        body {
          background-color: white;
        }
        .case-header, .case-detail {
          font-size: 14px;
        }
        .footer {
          font-size: 10px;
        }
      }
    </style>
  `);
  printWindow.document.write("</head><body>");
  printWindow.document.write("<h1>Legal Case Information</h1>");
  printWindow.document.write("<h2>Case List</h2>");

  filteredCases.forEach((c) => {
    printWindow.document.write(`
      <div class="case-header">Case: ${c.caseNumber} - ${c.title}</div>
      <div class="case-section">
        <div class="case-detail"><span>Case Type:</span> ${c.caseType}</div>
        <div class="case-detail"><span>Status:</span> ${c.status}</div>
        <div class="case-detail"><span>Court:</span> ${c.courtName}</div>
        <div class="case-detail"><span>Next Hearing Date:</span> ${c.nextHearingDate ? new Date(c.nextHearingDate).toLocaleDateString() : 'N/A'}</div>
        <div class="case-detail"><span>Filing Date:</span> ${c.filingDate ? new Date(c.filingDate).toLocaleDateString() : 'N/A'}</div>
        <div class="case-detail"><span>Fees:</span> ${c.fees}</div>
        <div class="case-detail"><span>Payment Status:</span> ${c.paymentStatus}</div>
        <div class="case-detail"><span>Outcome:</span> ${c.caseOutcome}</div>
        <div class="case-detail"><span>Court Address:</span> ${c.courtAddress}</div>
      </div>
    `);
  });

  printWindow.document.write("<div class='footer'>Printed by [Your Name or Organization]</div>");
  printWindow.document.write("</body></html>");

  printWindow.document.close();
  printWindow.print();
};
