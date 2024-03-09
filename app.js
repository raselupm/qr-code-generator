const express = require('express');
const qr = require('qrcode');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/qr', async (req, res) => {
    try {
        const { text, color, bg } = req.query;

        if (!text) {
            return res.status(400).send('Missing required parameters');
        }

        // Default colors
        const defaultColor = '#000000';
        const defaultBgColor = '#FFFFFF';

        // Use query parameters if available, otherwise use defaults
        const darkColor = color || defaultColor;
        const lightColor = bg || defaultBgColor;

        const qrCode = await qr.toDataURL(text, {
            margin: 1,
            height: 800,
            width: 800,
            color: {
                dark: darkColor,
                light: lightColor
            }
        });

        // Set response headers for image
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Disposition': 'inline; filename=qr-code.png'
        });

        // Send the image data
        res.end(Buffer.from(qrCode.split(',')[1], 'base64'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating QR code');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
