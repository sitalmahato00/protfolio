import { useForm, Link, Head } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout title="Reset Password" subtitle="Enter your email to receive a reset link">
            <Head title="Forgot Password" />

            <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
                No worries — just enter your email and we'll send you a secure link to reset your password.
            </p>

            {status && (
                <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '10px', color: '#4ade80', fontSize: '13px' }}>
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div style={{ marginBottom: '20px' }}>
                    <label className="auth-label">Email Address</label>
                    <input
                        className="auth-input"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        placeholder="your@email.com"
                        autoFocus
                    />
                    {errors.email && <div className="auth-error">{errors.email}</div>}
                </div>

                <button type="submit" className="auth-btn-blue" disabled={processing} style={{ marginBottom: '16px' }}>
                    {processing ? 'Sending…' : 'Send Reset Link →'}
                </button>

                <div style={{ textAlign: 'center' }}>
                    <Link href={route('login')} className="auth-link">← Back to Login</Link>
                </div>
            </form>
        </AuthLayout>
    );
}
