import { createContext } from 'react'
import { AuthContextType } from './client-provider'

export const AuthContext = createContext<AuthContextType>(null!)
