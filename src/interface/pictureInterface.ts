export interface Picture {
   id: string;
   url: string;
   alt: string;
   type: string;
   sizeKB: number;
   uploadedAt: string;
}

export interface PaymentProof {
   id: string;
   reservationId: picture;
   pictureId: string;
   picture: Picture;
   createdAt: string;
   updatedAt: string;
}

export interface picture {
   id: string;
   url: string;
   alt: string;
   type: string;
   sizeKB: number;
   updatedAt: string;
   uploadedAt: string;
}
