import { Metadata } from "next";

export const metadata:Metadata={
    title:"Privacy Policy | Asia Drone Store",
    description:"Read the privacy policy for using Asia Drone Store services. Our legal agreement covers data protection, privacy, and more.",
    keywords:['privacy policy','data protection','privacy','Asia Drone Store privacy policy'],
    openGraph:{
        title:"Privacy Policy | Asia Drone Store",
        description:"Understand your privacy rights when using Asia Drone Store.",
        url:"https://asiadronestore.online/privacy",
        siteName:"Asia Drone Store",
        images:[
            {
                url:"https://asiadronestore.online/log-ads.png",
                width:1200,
                height:630,
                alt:"Asia Drone Store - Privacy Policy",
            },
        ],
        locale:"en_US",
        type:"article",
    },
    twitter:{
        card:"summary_large_image",
        title:"Privacy Policy | Asia Drone Store",
        description:"Understand your privacy rights when using Asia Drone Store.",
        images:["https://asiadronestore.online/log-ads.png"],
    },
    robots:{
        index:true,
        follow:true,
        googleBot:{
            index:true,
            follow:true,
            'max-video-preview':-1,
            'max-image-preview':'large',
            'max-snippet':-1,
        },
    },
}

export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
