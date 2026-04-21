import { Metadata } from "next";

export const metadata:Metadata={
    title:"Contact Us | Asia Drone Store",
    description:"Contact Asia Drone Store for any queries, support, or information about our products and services.",
    keywords:["contact","support","inquiry","Asia Drone Store","drone store","drone shop","drone online","drone accessories","drone India"],
    openGraph:{
        title:"Contact Us | Asia Drone Store",
        description:"Contact Asia Drone Store for any queries, support, or information about our products and services.",
        url:"https://asiadronestore.online/contact",
        siteName:"Asia Drone Store",
        images:[
            {
                url:"https://asiadronestore.online/log-ads.png",
                width:1200,
                height:630,
                alt:"Asia Drone Store Contact Us",
            },
        ],
        locale:"en_US",
        type:"article",
    },
    twitter:{
        card:"summary_large_image",
        title:"Contact Us | Asia Drone Store",
        description:"Contact Asia Drone Store for any queries, support, or information about our products and services.",
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

export default function ContactLayout({
    children,
}:{
    children:React.ReactNode
}){
    return <>{children}</>
}
