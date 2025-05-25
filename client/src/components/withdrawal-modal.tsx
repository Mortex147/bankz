import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { withdrawalSchema, type WithdrawalFormData } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { Info } from "lucide-react";

interface WithdrawalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawalModal({ open, onOpenChange }: WithdrawalModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0,
      method: "bank_transfer",
    },
  });

  const withdrawalMutation = useMutation({
    mutationFn: async (data: WithdrawalFormData) => {
      return await apiRequest("POST", "/api/withdrawal", data);
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal Request Submitted",
        description: `Withdrawal request of $${form.getValues().amount} submitted for approval`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Failed to process withdrawal request",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WithdrawalFormData) => {
    withdrawalMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Request Withdrawal</DialogTitle>
        </DialogHeader>
        
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Withdrawals are processed within 2-3 business days. Minimum withdrawal amount is $25.
          </AlertDescription>
        </Alert>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="25.00"
                      min="25"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-1">
                    Available balance: ${user?.balance || "0.00"}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Withdrawal Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select withdrawal method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={withdrawalMutation.isPending}
              >
                {withdrawalMutation.isPending ? "Processing..." : "Request Withdrawal"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
