import { Metadata } from "next";

export const metadata : Metadata ={
    title:"Help & Support | Asia Drone Store",
    description:"Get assistance with your drone orders, tracking, warranty, and technical support. Our Help Center is here to provide answers and guide you through any issues.",
    keywords:["help","DGCA","support","inquiry","Asia Drone Store","drone store","drone shop","drone online","drone accessories","drone India"],
    openGraph:{
        title:"Help & Support | Asia Drone Store",
        description:"Get assistance with your drone orders, tracking, warranty, and technical support. Our Help Center is here to provide answers and guide you through any issues.",
        url:"https://asiadronestore.online/help",
        siteName:"Asia Drone Store",
        images:[
            {
                url:"https://asiadronestore.online/log-ads.png",
                width:1200,
                height:630,
                alt:"Asia Drone Store Help & Support",
            },
        ],
        locale:"en_US",
        type:"article",
    },
    twitter:{
        card:"summary_large_image",
        title:"Help & Support | Asia Drone Store",
        description:"Get assistance with your drone orders, tracking, warranty, and technical support. Our Help Center is here to provide answers and guide you through any issues.",
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

export default function HelpLayout({
    children,
}:{
    children:React.ReactNode
}){
    return <>{children}</>
}