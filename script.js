document.addEventListener("DOMContentLoaded", function () {
  renderLoansTable();

  const loanForm = document.getElementById("loan-input-form");
  if (loanForm) {
    loanForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // جلب الحقول بدقة عالية
      const nameEl = document.getElementById("loan-emp-name");
      const totalEl = document.getElementById("loan-total-amount");
      const monthsEl = document.getElementById("loan-months");
      const startMonthEl = document.getElementById("loan-start-month");

      const name = nameEl.value.trim();
      const total = parseFloat(totalEl.value);
      
      // إذا لم يحدد أشهر نعتبرها شهر واحد (تسديد فوري)
      const months = (monthsEl.value && parseInt(monthsEl.value) > 0) ? parseInt(monthsEl.value) : 1;
      // جلب اختيار الشهر اليدوي من القائمة المنسدلة
      const startMonthIndex = parseInt(startMonthEl.value);

      if (isNaN(total) || total <= 0) {
        alert("الرجاء إدخال إجمالي سلفة صحيح.");
        return;
      }

      // حساب قيمة القسط الشهري العادل بدون كسور معقدة
      const monthlyInstallment = Math.round(total / months);
      let monthlyDistribution = Array(12).fill("-");
      let remainingAmount = total;

      // توزيع المبالغ ابتداءً من الشهر المحدد يدوياً
      for (let i = 0; i < months; i++) {
        let targetMonth = (startMonthIndex + i) % 12;
        if (i === months - 1) {
          monthlyDistribution[targetMonth] = remainingAmount; // الشهر الأخير يأخذ المتبقي الفعلي
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

      // الحفظ الآمن في LocalStorage واختفاء الـ NaN تماماً
      let loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
      loans.unshift(newLoan);
      localStorage.setItem("five_caravans_loans", JSON.stringify(loans));

      // إعادة عرض الجدول وتصفير الحقول
      renderLoansTable();
      loanForm.reset();
    });
  }
});

// دالة بناء وعرض الجدول السنوي للسلف
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

    // تعبئة الـ 12 شهراً بالمبالغ أو الشرطات
    l.monthsData.forEach(monthVal => {
      if (monthVal === "-") {
        rowHtml += `<td class="p-3 text-slate-300 font-mono">-</td>`;
      } else {
        rowHtml += `<td class="p-3 font-bold text-blue-700 font-mono">${parseFloat(monthVal).toLocaleString('en-US')}</td>`;
      }
    });

    // المتبقي والإجمالي مع أزرار التحكم
    rowHtml += `
      <td class="p-3 bg-amber-50/40 font-bold text-amber-700 font-mono">
        <span class="bg-amber-100/70 px-2 py-1 rounded-md border border-amber-200/50">${parseFloat(l.remaining).toLocaleString('en-US')}</span>
      </td>
      <td class="p-3 bg-emerald-50/40 font-bold text-emerald-700 font-mono">
        <span class="bg-emerald-100/70 px-2 py-1 rounded-md border border-emerald-200/50">${parseFloat(l.total).toLocaleString('en-US')}</span>
      </td>
      <td class="p-3">
        <div class="flex items-center justify-center gap-2">
          <button onclick="settleLoan(${l.id})" class="text-amber-600 hover:text-amber-800 font-bold hover:underline">تسوية</button>
          <span class="text-slate-300">|</span>
          <button onclick="deleteLoan(${l.id})" class="text-red-500 hover:text-red-700 font-bold hover:underline">حذف</button>
        </div>
      </td>
    </tr>`;

    tableBody.innerHTML += rowHtml;
  });
}

// دالة التسوية الفورية
function settleLoan(id) {
  if (confirm("هل أنت متأكد من تسوية هذه السُلفة بالكامل؟")) {
    let loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
    loans = loans.map(l => {
      if (l.id === id) {
        l.remaining = 0;
        l.monthsData = Array(12).fill("-");
      }
      return l;
    });
    localStorage.setItem("five_caravans_loans", JSON.stringify(loans));
    renderLoansTable();
  }
}

// دالة الحذف النهائي والكامل للسجل
function deleteLoan(id) {
  if (confirm("تنبيه: هل تريد حذف سجل السلفة هذا نهائياً من النظام؟")) {
    let loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
    loans = loans.filter(l => l.id !== id);
    localStorage.setItem("five_caravans_loans", JSON.stringify(loans));
    renderLoansTable();
  }
}
