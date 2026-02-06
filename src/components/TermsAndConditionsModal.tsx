import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsAndConditionsModalProps {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

export const TermsAndConditionsModal = ({
  open,
  onAccept,
  onCancel,
}: TermsAndConditionsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read and accept the terms and conditions to proceed with your booking.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] w-full border rounded-md p-4">
          <div className="space-y-4 pr-4">
            <section>
              <p className="text-sm text-gray-600">
                1. Booking Terms: By booking tickets through this platform, you agree to these terms and conditions. All bookings are subject to availability and confirmation.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600">
                2. Ticket Validity: Tickets are valid only for the specified date, time, and venue mentioned in your booking confirmation. Entry is restricted to the date and time stated on your ticket.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600">
                3. Cancellation Policy: Cancellations must be requested at least 48 hours before the event. A refund of 80% of the ticket price will be processed, minus the convenience fee. No refunds will be issued for cancellations made within 48 hours of the event.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600">
                4. Entry and Conduct: Ticket holders must adhere to all venue rules and regulations. The management reserves the right to deny entry to individuals who are intoxicated, disruptive, or in violation of venue policies.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600">
                5. Prohibited Items: The following items are not permitted inside the venue: weapons of any kind, outside food and beverages, professional recording equipment, and items that may disrupt the event.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600">
                6. Photography and Recording: Personal photography and video recording are allowed for non-commercial purposes only. Professional or commercial recording without prior permission is strictly prohibited.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600">
                7. Liability: The theatre and booking platform are not responsible for lost, stolen, or damaged personal belongings. We also disclaim liability for any injuries or accidents that occur during the event unless caused by our negligence.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600">
                8. Payment Terms: All prices are in Indian Rupees (₹). A convenience fee is applicable to all online bookings. Payment must be completed to confirm your booking.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600">
                9. Seat Selection: Seats are allocated on a first-come, first-served basis. The theatre reserves the right to modify or relocate seating arrangements if necessary.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600">
                10. Health and Safety: All ticket holders and guests must comply with applicable health and safety regulations. The theatre may implement additional safety measures without prior notice.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600">
                11. Age Restrictions: Certain events may have age restrictions. Please ensure you meet the minimum age requirement before booking. Valid ID may be required at entry.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600">
                12. Changes to Events: The theatre reserves the right to postpone, reschedule, or cancel events due to unforeseen circumstances. In such cases, ticket holders will be notified and offered alternatives or refunds.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600">
                13. Data Privacy: Your personal information is collected only for booking purposes. We maintain strict confidentiality and do not share your data with third parties without consent.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600">
                14. Dispute Resolution: Any disputes arising from bookings will be resolved through mutual discussion. In case of unresolved disputes, the matter will be subject to the jurisdiction of local courts.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600">
                15. Modification of Terms: The theatre reserves the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting to the website.
              </p>
            </section>
          </div>
        </ScrollArea>


        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            Decline
          </Button>
          <Button onClick={onAccept} className="bg-green-600 hover:bg-green-700">
            Accept and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
