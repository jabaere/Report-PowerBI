import "../styles/globals.css"
import { Alfa_Slab_One, Caveat } from 'next/font/google'

const fnt_alpha = Alfa_Slab_One({
  subsets: ['latin'],
  variable: '--font-fnt_alpha', 
  weight:'400'
})

const font_caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-h1_caveat', 
  weight:'700'
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={font_caveat.variable}>
      <body>{children}</body>
    </html>
  )
}