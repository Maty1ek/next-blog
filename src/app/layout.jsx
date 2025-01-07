import Link from "next/link";
import "./globals.css";
import localFont from 'next/font/local'
import {Poppins} from 'next/font/google'
import Navigation from '../components/Navigation'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '400', '700'],
  variable: '--font-poppins'
})

// const myFont = localFont({
//   src: [
//     {
//       path: '../fonts/Roboto-Medium.ttf',
//       weight: '500',
//       style: 'medium'
//     },
//     {
//       path: '../fonts/Roboto-Bold.ttf',
//       weight: '600',
//       style: 'bold'
//     }
//   ]
// })

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body 
      // className={myFont.className}
      // className={poppins.className}
      className={`${poppins.variable} font-sans`}
      >
        <header >
          <Navigation />
        </header>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  );
}
