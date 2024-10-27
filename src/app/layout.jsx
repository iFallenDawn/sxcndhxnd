import localFont from "next/font/local";
import "./globals.css";
import Navbar from '../components/nav/Navbar'

const arnoProRegular = localFont({
  src: './fonts/ArnoPro-Regular.otf'
})

export const metadata = {
  title: "sxcndhxnd",
  description: "Nico Montemayor's sxcndhxnd",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <link rel="shortcut icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={`${arnoProRegular.className}`}>
        <Navbar />
        <div className='mt-12'>
          {children}
        </div>
      </body>
    </html>
  )
}

export default RootLayout