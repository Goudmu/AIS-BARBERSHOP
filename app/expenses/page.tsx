import CardExpenses from "@/components/own/expenses/card/cardExpenses";
import FormExpenses from "@/components/own/expenses/form/formExpenses";

export default function ExpensesPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <FormExpenses />
      {/* <CardExpenses /> */}
    </div>
  );
}
