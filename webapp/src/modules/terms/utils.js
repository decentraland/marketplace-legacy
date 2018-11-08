import { getLocalStorage } from '@dapps/lib/localStorage'

export function hasAgreedToTerms() {
  const localStorage = getLocalStorage()
  return localStorage.getItem('seenTermsModal')
}

export function agreeToTerms() {
  const localStorage = getLocalStorage()
  localStorage.setItem('seenTermsModal', Date.now())
}
