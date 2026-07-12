if (document.getElementById("loans-table-body")) {
  renderLoansTable();
}

const loanForm = document.getElementById("loan-input-form");
if (loanForm) {
  loanForm.addEventListener("submit", function (e) {
    e.preventDefault();
    
    // جلب القيم والتأكد من مطابقة الـ IDs تماماً مع الـ HTML
    const nameInput = document.getElementById("loan-emp-name");
    const totalInput = document.getElementById("loan-total-amount");
    const monthsInput = document.getElementById("loan-months");

    if (!nameInput || !totalInput) return;

    const name = nameInput.value.trim();
    const total = parseFloat(totalInput.value);
    
    // إذا تركت خانة الأشهر فارغة، نعتبرها شهر واحد تلقائياً (بدون تقسيط)
    const months = (monthsInput && monthsInput.value && parseInt(monthsInput.value) > 0) ? parseInt(monthsInput.value) : 1;
    
    if (isNaN(total) || total <= 0) {
      alert("الرجاء إدخال مبلغ سلفة صحيح");
      return;
    }

    // تحديد الشهر الحالي (0 تعني يناير، 1 فبراير ... إلخ) لتبدأ السلفة من الشهر الحالي
    const currentMonthIndex = new Date().getMonth(); 
    const monthlyInstallment = Math.round(total / months);

    let monthlyDistribution = Array(12).fill("-");
    let remainingAmount = total;

    // توزيع الأقساط على الأشهر القادمة بالتساوي
    for (let i = 0; i < months; i++) {
      let targetMonth = (currentMonthIndex + i) % 12;
      if (i === months - 1) {
        monthlyDistribution[targetMonth] = remainingAmount; // الشهر الأخير يأخذ الباقي تماماً لضبط الكسور
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

    // الحفظ في LocalStorage
    let loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
    loans.unshift(newLoan);
    localStorage.setItem("five_caravans_loans", JSON.stringify(loans));

    // تحديث العرض وإعادة تعيين النموذج
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
    
    // عرض المبالغ الموزعة على الـ 12 شهراً (يناير هو المؤشر 0، ديسمبر هو 11)
    l.monthsData.forEach(monthVal => {
      if (monthVal === "-") {
        rowHtml += `<td class="p-3 text-slate-300 font-mono">-</td>`;
      } else {
        rowHtml += `<td class="p-3 font-bold text-blue-700 font-mono">${parseFloat(monthVal).toLocaleString('en-US')}</td>`;
      }
    });

    // المتبقي والإجمالي مع الأزرار المحدثة (تسوية وحذف)
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

// دالة تسوية السلفة المتبقية وتصفيرها دون حذف الاسم
function settleLoan(id) {
  if (confirm("هل أنت متأكد من تسوية وإغلاق هذه السُلفة بالكامل؟ سيتم تصفير المبلغ المتبقي.")) {
    let loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
    loans = loans.map(l => {
      if (l.id === id) {
        l.remaining = 0;
        l.monthsData = Array(12).fill("-"); // تصفير الأقساط في الجدول للأرشفة
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
