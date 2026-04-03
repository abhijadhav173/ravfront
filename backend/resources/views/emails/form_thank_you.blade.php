<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Thank you</title>
  </head>
  <body style="margin:0;padding:0;background-color:#000000;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background-color:#0b0b0b;border:1px solid rgba(255,255,255,0.1);">
            <tr>
              <td style="padding:24px 24px 8px 24px;text-align:center;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:24px;letter-spacing:2px;color:{{ $brandColor }};text-transform:uppercase;">{{ $brandName }}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 8px 24px;text-align:center;">
                <div style="height:1px;background:linear-gradient(90deg, {{ $brandColor }}, transparent);"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 12px 0;font-family:Georgia,Times,'Times New Roman',serif;font-weight:300;color:#ffffff;font-size:24px;line-height:1.3;">Thank you for your submission</h1>
                <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;color:#bbbbbb;line-height:1.6;font-size:14px;">
                  Hi {{ $submission->name }},
                </p>
                <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;color:#bbbbbb;line-height:1.6;font-size:14px;">
                  We received your <strong style="color:#ffffff;text-transform:uppercase;">{{ $submission->type }}</strong> form. Our team will review your submission and reach out if we have any questions.
                </p>
                <div style="margin:24px 0 8px 0;">
                  <div style="font-family:Arial,Helvetica,sans-serif;color:{{ $brandColor }};text-transform:uppercase;letter-spacing:1px;font-size:12px;margin-bottom:8px;">Summary</div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(255,255,255,0.1);">
                    <tr>
                      <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#999999;font-size:12px;">Name</td>
                      <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-size:12px;">{{ $submission->name }}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#999999;font-size:12px;">Email</td>
                      <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-size:12px;">{{ $submission->email }}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#999999;font-size:12px;">Type</td>
                      <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-size:12px;text-transform:uppercase;">{{ $submission->type }}</td>
                    </tr>
                  </table>
                </div>
                <p style="margin:16px 0 0 0;font-family:Arial,Helvetica,sans-serif;color:#777777;font-size:12px;line-height:1.6;">
                  — {{ $brandName }}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>

