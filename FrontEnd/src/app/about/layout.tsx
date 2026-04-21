import { Metadata } from "next";

export const metadata:Metadata={
    title:"About Us | Asia Drone Store",
    description:"Learn about Asia Drone Store, your one-stop destination for drones and drone accessories in India.",
    keywords:["drone store","DGCA","drone shop","drone online","drone accessories","drone India","Asia Drone Store"],
    openGraph:{
        title:"About Us | Asia Drone Store",
        description:"Learn about Asia Drone Store, your one-stop destination for drones and drone accessories in India.",
        url:"https://asiadronestore.online/about",
        siteName:"Asia Drone Store",
        images:[
            {
                url:"https://asiadronestore.online/log-ads.png",
                width:1200,
                height:630,
                alt:"Asia Drone Store About Us",
            },
        ],
        locale:"en_US",
        type:"article",
    },
    twitter:{
        card:"summary_large_image",
        title:"About Us | Asia Drone Store",
        description:"Learn about Asia Drone Store, your one-stop destination for drones and drone accessories in India.",
        images:["/log-ads.png"],
    },
    robots:{
        index:true,
        follow:true,
        googleBot:{
            index:true,
            follow:true,
            "max-video-preview":-1,
            "max-image-preview":"large",
            "max-snippet":-1,
        },
    },
}

export default function AboutLayout({
    children,
}:{
    children:React.ReactNode
}){
    return <>{children}</>
}


