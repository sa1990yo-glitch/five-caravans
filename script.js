if (document.getElementById("loans-table-body")) renderLoansTable();

const loanForm = document.getElementById("loan-input-form");
if (loanForm) {
  loanForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("loan-emp-name").value.trim();
    const total = parseFloat(document.getElementById("loan-total-amount").value);
    
    // حل مشكلة NaN: التحقق من القيمة المدخلة في الأشهر وحمايتها
    let monthsInput = document.getElementById("loan-months").value;
    const months = (monthsInput && parseInt(monthsInput) > 0) ? parseInt(monthsInput) : 1;
    
    // توزيع المبالغ السنوية تلقائياً بناءً على الشهر الحالي لعام 2026
    const currentMonthIndex = new Date().getMonth(); 
    const monthlyInstallment = Math.round(total / months);

    let monthlyDistribution = Array(12).fill("-");
    let remainingAmount = total;

    for (let i = 0; i < months; i++) {
      let targetMonth = (currentMonthIndex + i) % 12;
      if (i === months - 1) {
        monthlyDistribution[targetMonth] = remainingAmount; 
      } else {
        monthlyDistribution[targetMonth] = monthlyInstallment;
        remainingAmount -= monthlyInstallment;
      }
    }

    const newLoan = {
      id: Date.now(),
      name: name,
      total: total,
      remaining: total,
      monthsData: monthlyDistribution
    };

    let loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
    loans.unshift(newLoan);
    localStorage.setItem("five_caravans_loans", JSON.stringify(loans));

    renderLoansTable();
    loanForm.reset();
  });
}

// دالة عرض وتحديث محتويات جدول السلف السنوي
function renderLoansTable() {
  const tableBody = document.getElementById("loans-table-body");
  if (!tableBody) return;
  const loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
  
  if (loans.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="16" class="py-8 text-center text-slate-400 italic bg-white">لا توجد سجلات سلف مالية نشطة حالياً.</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";
  loans.forEach(l => {
    let rowHtml = `<tr class="hover:bg-slate-50/80 transition-all border-b border-slate-100">
      <td class="p-3 text-right font-bold text-slate-800 bg-white sticky right-0 z-10 border-l border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">${l.name}</td>`;
    
    // عرض الأشهر السنوية
    l.monthsData.forEach(monthVal => {
      if (monthVal === "-") {
        rowHtml += `<td class="p-3 text-slate-300 font-mono">-</td>`;
      } else {
        rowHtml += `<td class="p-3 font-bold text-blue-700 font-mono">${parseFloat(monthVal).toLocaleString('en-US')}</td>`;
      }
    });

    // المتبقي والإجمالي بالتصميم اللوني الفخم
    rowHtml += `
      <td class="p-3 bg-amber-50/40 font-bold text-amber-700 font-mono">
        <span class="bg-amber-100/70 px-2 py-1 rounded-md border border-amber-200/50">${parseFloat(l.remaining).toLocaleString('en-US')}</span>
      </td>
      <td class="p-3 bg-emerald-50/40 font-bold text-emerald-700 font-mono">
        <span class="bg-emerald-100/70 px-2 py-1 rounded-md border border-emerald-200/50">${parseFloat(l.total).toLocaleString('en-US')}</span>
      </td>
      <td class="p-3 flex items-center justify-center gap-3 h-full mt-1.5">
        <button onclick="settleLoan(${l.id})" class="text-amber-600 hover:text-amber-800 font-bold hover:underline">تسوية</button>
        <span class="text-slate-300">|</span>
        <button onclick="deleteLoan(${l.id})" class="text-red-500 hover:text-red-700 font-bold hover:underline">حذف</button>
      </td>
    </tr>`;
    
    tableBody.innerHTML += rowHtml;
  });
}

// دالة تسوية السلفة المتبقية وتصفيرها دون حذف الاسم
function settleLoan(id) {
  if (confirm("هل أنت متأكد من تسوية وإغلاق هذه السُلفة بالكامل؟ سيتم تصفير المبلغ المتبقي.")) {
    let loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
    loans = loans.map(l => {
      if (l.id === id) {
        l.remaining = 0;
        l.monthsData = Array(12).fill("-"); // تصفير الأقساط القادمة
      }
      return l;
    });
    localStorage.setItem("five_caravans_loans", JSON.stringify(loans));
    renderLoansTable();
  }
}

// دالة حذف قيد السلفة نهائياً من كشف الحساب
function deleteLoan(id) {
  if (confirm("تنبيه: هل أنت متأكد من حذف هذا السجل المالي نهائياً؟")) {
    let loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
    loans = loans.filter(l => l.id !== id);
    localStorage.setItem("five_caravans_loans", JSON.stringify(loans));
    renderLoansTable();
  }
}
