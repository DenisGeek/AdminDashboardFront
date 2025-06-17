// types/auth.ts
export interface AuthResponse {
  access: string
  refresh: string
}

export interface UserData {
  nameid: string // User ID
  email: string // User email
  role: string // User role
  exp: number // Expiration timestamp
  iat: number // Issued at timestamp
  iss?: string // Issuer (optional)
  aud?: string // Audience (optional)
}

// api/auth.ts
export const login = async (
  email: string,
  password: string
): Promise<{ tokens: AuthResponse; user: UserData }> => {
  try {
    const response = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message ||
          errorData.detail ||
          `Authentication failed with status ${response.status}`
      )
    }

    const tokens: AuthResponse = await response.json()

    if (!tokens.access || !tokens.refresh) {
      throw new Error('Invalid server response - tokens missing')
    }

    const user = parseJwt(tokens.access)

    return { tokens, user }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Login failed: ${error.message}`)
    }
    throw new Error('Unknown error occurred during login')
  }
}

export const parseJwt = (token: string): UserData => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload) as UserData
  } catch {
    throw new Error('Failed to parse JWT token')
  }
}
