import LoginForm from "./login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
        <LoginForm />
      </div>
    </div>
  )
}
