import { useForm, Head } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <AuthLayout title="New Password" subtitle="Choose a strong new password">
            <Head title="Reset Password" />

            <form onSubmit={submit}>
                <div style={{ marginBottom: '16px' }}>
                    <label className="auth-label">Email Address</label>
                    <input
                        className="auth-input"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        autoComplete="username"
                    />
                    {errors.email && <div className="auth-error">{errors.email}</div>}
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label className="auth-label">New Password</label>
                    <input
                        className="auth-input"
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        placeholder="••••••••"
                        autoFocus
                        autoComplete="new-password"
                    />
                    {errors.password && <div className="auth-error">{errors.password}</div>}
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label className="auth-label">Confirm New Password</label>
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

                <button type="submit" className="auth-btn-blue" disabled={processing}>
                    {processing ? 'Resetting…' : 'Reset Password →'}
                </button>
            </form>
        </AuthLayout>
    );
}
