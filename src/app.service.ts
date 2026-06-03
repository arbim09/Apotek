import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const port = process.env.APP_PORT || 3000;

    return `
      <!doctype html>
      <html lang="id">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Apotek Backend</title>
          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: Arial, sans-serif;
              background: linear-gradient(135deg, #0f766e, #14b8a6);
              color: #0f172a;
            }

            .card {
              width: min(90%, 520px);
              padding: 32px;
              border-radius: 18px;
              background: #ffffff;
              box-shadow: 0 20px 45px rgba(15, 23, 42, 0.22);
              text-align: center;
            }

            .status {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 8px 14px;
              border-radius: 999px;
              background: #dcfce7;
              color: #166534;
              font-weight: 700;
              margin-bottom: 18px;
            }

            .dot {
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: #22c55e;
            }

            h1 {
              margin: 0 0 10px;
              font-size: 30px;
            }

            p {
              margin: 8px 0;
              color: #475569;
              line-height: 1.6;
            }

            .port {
              margin-top: 18px;
              padding: 14px;
              border-radius: 12px;
              background: #f1f5f9;
              font-size: 18px;
              font-weight: 700;
              color: #0f766e;
            }

            a {
              display: inline-block;
              margin-top: 20px;
              color: #0f766e;
              font-weight: 700;
              text-decoration: none;
            }

            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <main class="card">
            <div class="status">
              <span class="dot"></span>
              BACKEND BERJALAN
            </div>
            <h1>Apotek Backend API</h1>
            <p>Server backend berhasil berjalan dan siap menerima request.</p>
            <div class="port">Port: ${port}</div>
            <a href="/api/docs">Buka Swagger API Docs</a>
          </main>
        </body>
      </html>
    `;
  }
}
