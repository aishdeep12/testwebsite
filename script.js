$(document).ready(() => {
  // Directly include the JSON data in the script
  const jsonData = [
    {
      "SKU": 6288922341270,
      "Style": 6288922341271,
      "Color": "Red",
      "Size": 2,
      "Price": 10
    },
    {
      "SKU": 8901719305191,
      "Style": 890171930,
      "Color": "blue",
      "Size": 1,
      "Price": 5
    },
    {
      "SKU": 1212,
      "Style": 1212,
      "Color": "green",
      "Size": 1,
      "Price": 10
    },
    {
      "SKU": "0627735019888",
      "Style": 1213,
      "Color": "blue",
      "Size": 1,
      "Price": 10
    }
  ];

  let scannerIsRunning = false;
  let data = jsonData;
  let scannedValue = null;

  // Display the data in the table
  function displayData(jsonData) {
    console.log('Displaying data:', jsonData);
    const $dataBody = $('#dataBody');
    $dataBody.empty();

    if (jsonData.length > 0) {
      jsonData.forEach(row => {
        const $tr = $('<tr>');
        Object.values(row).forEach(value => {
          const $td = $('<td>').text(value);
          $tr.append($td);
        });
        $dataBody.append($tr);
      });
    } 
  }

  // Initialize QuaggaJS and set up barcode scanning
  function initializeScanner() {
    console.log('Initializing scanner...');
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: document.querySelector('#scanner-container'),
          constraints: {
            facingMode: 'environment' // Use the back camera, change as needed
          }
        },
        decoder: {
          readers: ['ean_reader'] // Specify the barcode format you want to scan, e.g., EAN
        }
      },
      err => {
        if (err) {
          console.error('Error initializing Quagga:', err);
          return;
        }

        console.log('Scanner initialized successfully.');

        // Start barcode scanning
        Quagga.start();
        scannerIsRunning = true;
      }
    );

    // Listen for barcode scan results
    Quagga.onDetected(result => {
      const barcode = result.codeResult.code;
      console.log('Scanned barcode:', barcode);
      scannedValue = barcode;
      $('#scannedValue').text(scannedValue);
      lookupData();
      stopScanner();
    });
  }

  // Stop barcode scanning
  function stopScanner() {
    if (scannerIsRunning) {
      Quagga.stop();
      scannerIsRunning = false;
      console.log('Scanner stopped.');
    }
  }

  // Open the camera and start barcode scanning
  $('#scanButton').click(() => {
    if (!scannerIsRunning) {
      initializeScanner();
    }
  });

  // Lookup data based on the scanned barcode or entered value
  $('#lookupButton').click(() => {
    const value = $('#barcodeInput').val().trim();
    console.log('Lookup value:', value);
    $('#lookupValue').text(value);
    lookupData();
  });

  // Lookup data based on the scanned barcode or entered value
  function lookupData() {
    const value = String(scannedValue || $('#lookupValue').text().trim());
    const matchedRows = data.filter(row => {
      const rowSKU = String(row['SKU']); // Update the column header to 'SKU'
      return rowSKU === value;
    });

    if (matchedRows.length > 0) {
      const tableData = matchedRows.map(row => Object.values(row));
      displayData(tableData);
    } else {
      displayData([]);
      $('#dataBody').append('<tr><td colspan="5">No value found</td></tr>');
    }
  }
});
