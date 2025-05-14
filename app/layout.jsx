// import Provider from '@/components/provider';
// import { ThemeInitializer } from '@/components/public';
import { metadata as meta } from "@/setting/meta";
import './globals.css';
export const metadata = {
    metadataBase: new URL(meta.url  ),
    title:meta.title,
    description:meta.description,
    keywords:meta.keywords,
    openGraph:{
        title:meta.title,
        description:meta.description,
        url:meta.url,
        siteName:meta.title,
        images:meta.images.map(link=>({url:link})),
        locale:meta.locale,
        type:'website'
    },
    twitter:{
        card:'summary_large_image',
        title:meta.title,
        description:meta.description,
        images:meta.images
    },
    robots:{
        index:meta.index,
        follow:meta.follow,
        nocache:false
    },
    icons:{
        icon:meta.icon,
        apple:meta.appleicon,
        shortcut:meta.shortcut
    }
}

export default function RootLayout({children}){
    return <html lang={meta.locale} suppressHydrationWarning>
        <body>
            {children}
        </body>
    </html>
}