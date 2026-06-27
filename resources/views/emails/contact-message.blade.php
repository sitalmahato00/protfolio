<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>New Contact Message</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.08);overflow:hidden;">
            <tr><td style="padding:32px 32px 0;">
                <div style="width:44px;height:44px;background:linear-gradient(135deg,#6366F1,#8B5CF6);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h1 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#0F172A;">New Contact Message</h1>
                <p style="margin:0 0 24px;font-size:14px;color:#64748B;">Someone reached out from your portfolio.</p>
            </td></tr>
            <tr><td style="padding:0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr><td style="padding:12px 0;border-top:1px solid #E2E8F0;">
                        <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#94A3B8;margin-bottom:2px;">Name</div>
                        <div style="font-size:14px;color:#0F172A;">{{ $contact->name }}</div>
                    </td></tr>
                    <tr><td style="padding:12px 0;border-top:1px solid #E2E8F0;">
                        <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#94A3B8;margin-bottom:2px;">Email</div>
                        <div style="font-size:14px;color:#0F172A;"><a href="mailto:{{ $contact->email }}" style="color:#6366F1;text-decoration:none;">{{ $contact->email }}</a></div>
                    </td></tr>
                    @if($contact->subject)
                    <tr><td style="padding:12px 0;border-top:1px solid #E2E8F0;">
                        <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#94A3B8;margin-bottom:2px;">Subject</div>
                        <div style="font-size:14px;color:#0F172A;">{{ $contact->subject }}</div>
                    </td></tr>
                    @endif
                    <tr><td style="padding:12px 0;border-top:1px solid #E2E8F0;">
                        <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#94A3B8;margin-bottom:4px;">Message</div>
                        <div style="font-size:14px;color:#0F172A;line-height:1.6;white-space:pre-wrap;">{{ $contact->message }}</div>
                    </td></tr>
                </table>
            </td></tr>
            <tr><td style="padding:24px 32px 32px;">
                <a href="{{ url('/admin/messages') }}" style="display:inline-block;background:linear-gradient(135deg,#6366F1,#8B5CF6);color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">View in Dashboard</a>
            </td></tr>
        </table>
    </td></tr></table>
</body>
</html>
