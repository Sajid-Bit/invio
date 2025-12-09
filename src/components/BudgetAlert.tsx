interface BudgetAlertProps {
  message: string;
}

const BudgetAlert = ({ message }: BudgetAlertProps) => {
  return (
    <div className="bg-red-50/90 backdrop-blur-sm border border-red-100 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm animate-pulse">
      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-xl shadow-inner">
        ⚠️
      </div>
      <div>
        <h3 className="font-bold text-sm">تنبيه الموازنة</h3>
        <p className="text-xs font-medium opacity-90">{message}</p>
      </div>
    </div>
  );
};

export default BudgetAlert;
