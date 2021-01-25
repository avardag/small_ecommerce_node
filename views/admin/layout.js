module.exports = ({ content }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>
    <style>
      body {
        background-color: #707070;
      }
    </style>
  </head>
  <body>
    ${content}
  </body>
  </html>
  `;
};
