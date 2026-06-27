import { useForm, Link, Head } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <AuthLayout title="Create Account" subtitle="Set up your portfolio admin account">
            <Head title="Register" />

            <form onSubmit={submit}>
                <div style={{ marginBottom: '16px' }}>
                    <label className="auth-label">Full Name</label>
                    <input
                        className="auth-input"
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="Sital Mahato"
                        autoFocus
                        autoComplete="name"
                    />
                    {errors.name && <div className="auth-error">{errors.name}</div>}
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label className="auth-label">Email Address</label>
                    <input
                        className="auth-input"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        placeholder="your@email.com"
                        autoComplete="username"
                    />
                    {errors.email && <div className="auth-error">{errors.email}</div>}
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label className="auth-label">Password</label>
                    <input
                        className="auth-input"
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                    />
                    {errors.password && <div className="auth-error">{errors.password}</div>}
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label className="auth-label">Confirm Password</label>
                    <input
                        className="auth-input"
                        type="password"
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                    />
                    {errors.password_confirmation && <div className="auth-error">{errors.password_confirmation}</div>}
                </div>

                <button type="submit" className="auth-btn-primary" disabled={processing} style={{ marginBottom: '16px' }}>
                    {processing ? 'Creating account…' : 'Create Account →'}
                </button>

                <div style={{ textAlign: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Already have an account? </span>
                    <Link href={route('login')} className="auth-link">Sign in</Link>
                </div>
            </form>
        </AuthLayout>
    );
}
