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
   reservationId: string;
   pictureId: string;
   picture: Picture;
   createdAt: string;
   updatedAt: string;
}
