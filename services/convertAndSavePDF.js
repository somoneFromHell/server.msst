const puppeteer = require('puppeteer');
const fs = require('fs');

exports.convertAndSavePDF = async (html,pdfPath) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
          }
  
          .container {
              margin: 20px;
          }
  
          .card {
              border: 1px solid #ccc;
              border-radius: 10px;
              overflow: hidden;
              margin-bottom: 20px;
          }
  
          .card-body {
              padding: 20px;
          }
  
          .invoice-title {
              text-align: center;
              margin-bottom: 20px;
          }
  
          .invoice-title h4 {
              font-size: 15px;
              margin: 0;
          }
  
          .badge {
              font-size: 12px;
              margin-left: 5px;
          }
  
          .mb-4 h2 {
              font-size: 20px;
              margin: 0;
          }
  
          .text-muted p {
              margin: 5px 0;
          }
  
          .row {
              margin: 0 -10px;
          }
  
          .col-sm-6 {
              width: 50%;
              float: left;
              box-sizing: border-box;
              padding: 0 10px;
          }
  
          .text-muted h5 {
              font-size: 16px;
              margin: 15px 0 10px;
          }
  
          .text-muted h5,
          .text-muted p {
              margin: 0;
          }
  
          .py-2 h5 {
              font-size: 15px;
              margin: 10px 0;
          }
  
          table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
          }
  
          table, th, td {
              border: 1px solid #ddd;
          }
  
          th, td {
              padding: 10px;
              text-align: left;
          }
  
          th {
              background-color: #f2f2f2;
          }
  
          .text-end {
              text-align: right;
          }
  
          .mt-4 {
              margin-top: 20px;
          }
  
          .d-print-none {
              display: none;
          }
  
          .float-end {
              float: right;
          }
  
          .btn {
              padding: 10px;
              text-decoration: none;
              border-radius: 5px;
              cursor: pointer;
          }
  
          .btn-success {
              background-color: #28a745;
              color: #fff;
          }
  
          .btn-primary {
              background-color: #007bff;
              color: #fff;
          }
  
          @media print {
              .d-print-none {
                  display: block;
              }
          }
      </style>
  </head>
  <body>
  
  <div class="container">
      <div class="row">
          <div class="col-lg-12">
              <div class="card">
                  <div class="card-body">
                      <div class="invoice-title">
                          <h4 class="float-end font-size-15">Invoice #DS0204 <span class="badge bg-success font-size-12 ms-2">Paid</span></h4>
                          <div class="mb-4">
                              <h2 class="mb-1 text-muted">Bootdey.com</h2>
                          </div>
                          <div class="text-muted">
                              <p class="mb-1">3184 Spruce Drive Pittsburgh, PA 15201</p>
                              <p class="mb-1"><i class="uil uil-envelope-alt me-1"></i> xyz@987.com</p>
                              <p><i class="uil uil-phone me-1"></i> 012-345-6789</p>
                          </div>
                      </div>
  
                      <hr class="my-4">
  
                      <div class="row">
                          <div class="col-sm-6">
                              <div class="text-muted">
                                  <h5 class="font-size-16 mb-3">Billed To:</h5>
                                  <h5 class="font-size-15 mb-2">Preston Miller</h5>
                                  <p class="mb-1">4068 Post Avenue Newfolden, MN 56738</p>
                                  <p class="mb-1">PrestonMiller@armyspy.com</p>
                                  <p>001-234-5678</p>
                              </div>
                          </div>
                          <!-- end col -->
                          <div class="col-sm-6">
                              <div class="text-muted text-sm-end">
                                  <div>
                                      <h5 class="font-size-15 mb-1">Invoice No:</h5>
                                      <p>#DZ0112</p>
                                  </div>
                                  <div class="mt-4">
                                      <h5 class="font-size-15 mb-1">Invoice Date:</h5>
                                      <p>12 Oct, 2020</p>
                                  </div>
                                  <div class="mt-4">
                                      <h5 class="font-size-15 mb-1">Order No:</h5>
                                      <p>#1123456</p>
                                  </div>
                              </div>
                          </div>
                          <!-- end col -->
                      </div>
                      <!-- end row -->
  
                      <div class="py-2">
                          <h5 class="font-size-15">Order Summary</h5>
  
                          <div class="table-responsive">
                              <table class="table align-middle table-nowrap table-centered mb-0">
                                  <thead>
                                  <tr>
                                      <th style="width: 70px;">No.</th>
                                      <th>Item</th>
                                      <th>Price</th>
                                      <th>Quantity</th>
                                      <th class="text-end" style="width: 120px;">Total</th>
                                  </tr>
                                  </thead><!-- end thead -->
                                  <tbody>
                                  <tr>
                                      <th scope="row">01</th>
                                      <td>
                                          <div>
                                              <h5 class="text-truncate font-size-14 mb-1">Black Strap A012</h5>
                                              <p class="text-muted mb-0">Watch, Black</p>
                                          </div>
                                      </td>
                                      <td>$ 245.50</td>
                                      <td>1</td>
                                      <td class="text-end">$ 245.50</td>
                                  </tr>
                                  <!-- end tr -->
                                  <tr>
                                      <th scope="row">02</th>
                                      <td>
                                          <div>
                                              <h5 class="text-truncate font-size-14 mb-1">Stainless Steel S010</h5>
                                              <p class="text-muted mb-0">Watch, Gold</p>
                                          </div>
                                      </td>
                                      <td>$ 245.50</td>
                                      <td>2</td>
                                      <td class="text-end">$491.00</td>
                                  </tr>
                                  <!-- end tr -->
                                  <tr>
                                      <th scope="row" colspan="4" class="text-end">Sub Total</th>
                                      <td class="text-end">$732.50</td>
                                  </tr>
                                  <!-- end tr -->
                                  <tr>
                                      <th scope="row" colspan="4" class="border-0 text-end">
                                          Discount :</th>
                                      <td class="border-0 text-end">- $25.50</td>
                                  </tr>
                                  <!-- end tr -->
                                  <tr>
                                      <th scope="row" colspan="4" class="border-0 text-end">
                                          Shipping Charge :</th>
                                      <td class="border-0 text-end">$20.00</td>
                                  </tr>
                                  <!-- end tr -->
                                  <tr>
                                      <th scope="row" colspan="4" class="border-0 text-end">
                                          Tax</th>
                                      <td class="border-0 text-end">$12.00</td>
                                  </tr>
                                  <!-- end tr -->
                                  <tr>
                                      <th scope="row" colspan="4" class="border-0 text-end">Total</th>
                                      <td class="border-0 text-end"><h4 class="m-0 fw-semibold">$739.00</h4></td>
                                  </tr>
                                  <!-- end tr -->
                                  </tbody><!-- end tbody -->
                              </table><!-- end table -->
                          </div><!-- end table responsive -->
                          <div class="d-print-none mt-4">
                              <div class="float-end">
                                  <a href="javascript:window.print()" class="btn btn-success me-1"><i class="fa fa-print"></i></a>
                                  <a href="#" class="btn btn-primary w-md">Send</a>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div><!-- end col -->
      </div>
  </div>
  
  </body>
  </html>
  
  `;

  await page.setContent(html);

  const pdfPath = '../Uploads/DonationRecipts/invoice.pdf';

  await page.pdf({
    path: pdfPath,
    format: 'A4',
  });

  console.log(`PDF saved to: ${pdfPath}`);

  await browser.close();
};
