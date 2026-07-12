if (document.getElementById("loans-table-body")) renderLoansTable();

const loanForm = document.getElementById("loan-input-form");
if (loanForm) {
  loanForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("loan-emp-name").value.trim();
    const total = parseFloat(document.getElementById("loan-total-amount").value);
    
    let monthsInput = document.getElementById("loan-months").value;
    const months = (monthsInput && parseInt(monthsInput) > 0) ? parseInt(monthsInput) : 1;
    
    // تحديد الشهر الحالي (0 تعني يناير، 5 تعني يونيو وهكذا)
    const currentMonthIndex = new Date().getMonth(); 
    const monthlyInstallment = Math.round(total / months);

    // إنشاء مصفوفة للأشهر الـ 12 وبداية التوزيع من الشهر الحالي
    let monthlyDistribution = Array(12).fill("-");
    let remainingAmount = total;

    for (let i = 0; i < months; i++) {
      let targetMonth = (currentMonthIndex + i) % 12;
      if (i === months - 1) {
        monthlyDistribution[targetMonth] = remainingAmount; // الشهر الأخير يأخذ الباقي لضبط الكسور
      } else {
        monthlyDistribution[targetMonth] = monthlyInstallment;
        remainingAmount -= monthlyInstallment;
      }
    }

    const newLoan = {
      id: Date.now(),
      name: name,
      total: total,
      remaining: total, // عند الإنشاء يكون المتبقي مساوياً للإجمالي
      monthsData: monthlyDistribution
    };

    let loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
    loans.unshift(newLoan);
    localStorage.setItem("five_caravans_loans", JSON.stringify(loans));

    renderLoansTable();
    loanForm.reset();
  });
}

function renderLoansTable() {
  const tableBody = document.getElementById("loans-table-body");
  if (!tableBody) return;
  const loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
  
  if (loans.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="16" class="py-6 text-center text-slate-400 italic">لا توجد سجلات سلف مالية حتى الآن.</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";
  loans.forEach(l => {
    let rowHtml = `<tr class="hover:bg-slate-50 transition-all">
      <td class="p-3 text-right font-bold text-slate-800 bg-white shadow-sm sticky right-0 z-10 border-l border-slate-100">${l.name}</td>`;
    
    // عرض توزيع المبالغ على الأشهر الـ 12
    l.monthsData.forEach(monthVal => {
      if (monthVal === "-") {
        rowHtml += `<td class="p-3 text-slate-300">-</td>`;
      } else {
        rowHtml += `<td class="p-3 font-semibold text-slate-700">${parseFloat(monthVal).toFixed(2)}</td>`;
      }
    });

    // المتبقي والإجمالي والإجراءات
    rowHtml += `
      <td class="p-3 bg-amber-50/70 font-bold text-amber-600">
        <span class="bg-amber-100 px-2 py-1 rounded-md text-[11px]">${l.remaining}</span>
      </td>
      <td class="p-3 bg-emerald-50/70 font-bold text-emerald-600">
        <span class="bg-emerald-100 px-2 py-1 rounded-md text-[11px]">${l.total}</span>
      </td>
      <td class="p-3">
        <button onclick="clearLoan(${l.id})" class="text-red-500 hover:text-red-700 font-bold hover:underline">تسوية</button>
      </td>
    </tr>`;
    
    tableBody.innerHTML += rowHtml;
  });
}

// دالة تسوية (حذف أو تصفير) السلفة
function clearLoan(id) {
  if(confirm("هل أنت متأكد من إجراء تسوية مالية لهذه السُلفة بالكامل؟")) {
    let loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
    loans = loans.filter(l => l.id !== id);
    localStorage.setItem("five_caravans_loans", JSON.stringify(loans));
    renderLoansTable();
  }
}
