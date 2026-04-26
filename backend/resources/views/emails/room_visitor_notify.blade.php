<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>New room visitor</title>
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
                <h1 style="margin:0 0 12px 0;font-family:Georgia,Times,'Times New Roman',serif;font-weight:300;color:#ffffff;font-size:22px;line-height:1.3;">
                  {{ $visitor->name }} entered <span style="color:{{ $brandColor }};">{{ $room->name }}</span>
                </h1>
                <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;color:#bbbbbb;line-height:1.6;font-size:14px;">
                  A new visitor just accessed your data room. Details below:
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(255,255,255,0.1);margin-bottom:16px;">
                  <tr>
                    <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#999999;font-size:12px;">Name</td>
                    <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-size:12px;">{{ $visitor->name }}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#999999;font-size:12px;">Email</td>
                    <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-size:12px;">{{ $visitor->email }}</td>
                  </tr>
                  @if($visitor->city || $visitor->country)
                  <tr>
                    <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#999999;font-size:12px;">Location</td>
                    <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-size:12px;">{{ trim(implode(', ', array_filter([$visitor->city, $visitor->region, $visitor->country]))) }}</td>
                  </tr>
                  @endif
                  <tr>
                    <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#999999;font-size:12px;">Room</td>
                    <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-size:12px;">{{ $room->name }}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#999999;font-size:12px;">Time</td>
                    <td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-size:12px;">{{ now()->format('M j, Y g:i A') }} UTC</td>
                  </tr>
                </table>
                <p style="margin:16px 0 0 0;font-family:Arial,Helvetica,sans-serif;color:#777777;font-size:12px;">
                  See full activity in the analytics dashboard.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
