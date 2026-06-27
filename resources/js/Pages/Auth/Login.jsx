import { useForm, Link, Head } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <AuthLayout title="Welcome Back" subtitle="Sign in to your admin panel">
            <Head title="Log in" />

            {status && (
                <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '10px', color: '#4ade80', fontSize: '13px' }}>
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div style={{ marginBottom: '16px' }}>
                    <label className="auth-label">Email Address</label>
                    <input
                        className="auth-input"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        placeholder="admin@example.com"
                        autoFocus
                        autoComplete="username"
                    />
                    {errors.email && <div className="auth-error">{errors.email}</div>}
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label className="auth-label" style={{ marginBottom: 0 }}>Password</label>
                        {canResetPassword && (
                            <Link href={route('password.request')} className="auth-link" style={{ fontSize: '12px' }}>Forgot password?</Link>
                        )}
                    </div>
                    <input
                        className="auth-input"
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                    {errors.password && <div className="auth-error">{errors.password}</div>}
                </div>

                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        className="auth-checkbox"
                        type="checkbox"
                        id="remember"
                        checked={data.remember}
                        onChange={e => setData('remember', e.target.checked)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor="remember" style={{ color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>Remember me</label>
                </div>

                <button type="submit" className="auth-btn-primary" disabled={processing}>
                    {processing ? 'Signing in…' : 'Sign In →'}
                </button>
            </form>
        </AuthLayout>
    );
}
