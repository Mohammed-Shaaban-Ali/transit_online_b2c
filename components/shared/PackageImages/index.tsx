"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

function PackageImages({
    selectedImages,
    isSmall = true
}: {
    selectedImages: string[]
    isSmall?: boolean
}) {
    const [showImageDialog, setShowImageDialog] = useState(false)
    const t = useTranslations("HotelsCard");
    return (
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
            <DialogTrigger className="w-full">
                <div
                    className="grid grid-cols-7 gap-2 overflow-hidden cursor-pointer w-full "
                >
                    <div className={`w-full ${isSmall ? 'h-[150px]' : 'h-[150px] sm:h-[220px]'} relative  overflow-hidden rounded-lg
                        ${selectedImages.length > 1 ? 'col-span-5' : 'col-span-7 w-full! object-cover'}
                        `}>
                        <Image
                            width={400}
                            height={250}
                            src={selectedImages[0]}
                            alt={`Package Image 1`}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                    {
                        selectedImages.length > 1 && (
                            <div className={`col-span-2 w-full ${isSmall ? 'h-[150px]' : 'h-[150px] sm:h-[220px]'} relative overflow-hidden rounded-lg`}>
                                <Image
                                    width={400}
                                    height={250}
                                    src={selectedImages[1]}
                                    alt={`Package Image 2`}
                                    className="w-full h-full object-cover rounded-lg"
                                />

                                {selectedImages.length > 2 && (
                                    <div className="absolute bottom-0 left-0 w-full h-full bg-black/40 flex items-center justify-center">
                                        <p className="text-white text-14 font-bold">
                                            +{selectedImages.length - 1} {t("more")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                </div>
            </DialogTrigger>
            <DialogContent
                className="max-w-6xl max-h-[75vh] w-[95vw] md:w-auto md:min-w-[1000px] overflow-y-auto p-0 rounded-2xl"
                showCloseButton={true}
            >
                {/* <DialogHeader className="bg-gray-200 flex items-center justify-between px-4 py-3 rounded-t-2xl flex-row text-left">
                    <DialogTitle className="text-lg font-bold text-black m-0">
                        {t("packageImages")}
                    </DialogTitle>
                </DialogHeader> */}
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedImages.map((image, index) => (
                            <div
                                key={index}
                                className="w-full h-[250px] relative overflow-hidden rounded-lg"
                            >
                                <Image
                                    width={400}
                                    height={250}
                                    src={image}
                                    alt={`Package Image ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PackageImages