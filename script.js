document.addEventListener("DOMContentLoaded", function () {
  // تشغيل عرض الجدول مباشرة عند تحميل الصفحة لقراءة السجلات المحفوظة
  renderLoansTable();

  // تفعيل الاستماع لنموذج إدخال السلف الخاص بتصميمك
  const loanForm = document.getElementById("loan-input-form") || document.querySelector("form");
  
  if (loanForm) {
    loanForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // جلب القيم بناءً على التصميم الفعلي لصفحتك واختيار المعرفات الصحيحة
      const nameInput = document.getElementById("loan-emp-name") || loanForm.querySelector('input[type="text"]');
      const totalInput = document.getElementById("loan-total-amount") || loanForm.querySelector('input[type="number"]');
      
      // جلب حقل الأشهر (إذا تُرِك فارغاً يُعتبر شهر واحد تلقائياً)
      const monthsInput = document.getElementById("loan-months") || loanForm.querySelectorAll('input[type="number"]')[1];

      if (!nameInput || !totalInput) {
        alert("لم يتم العثور على حقول الإدخال في الصفحة، يرجى التحقق من المعرفات.");
        return;
      }

      const name = nameInput.value.trim();
      const total = parseFloat(totalInput.value);
      const months = (monthsInput && monthsInput.value && parseInt(monthsInput.value) > 0) ? parseInt(monthsInput.value) : 1;

      if (!name) {
        alert("الرجاء إدخال اسم الموظف");
        return;
      }
      if (isNaN(total) || total <= 0) {
        alert("الرجاء إدخال مبلغ سلفة صحيح");
        return;
      }

      // الحساب التلقائي والتوزيع بناءً على الشهر الحالي لعام 2026
      const currentMonthIndex = new Date().getMonth(); // يناير = 0، فبراير = 1... إلخ
      const monthlyInstallment = Math.round(total / months);

      let monthlyDistribution = Array(12).fill("-");
      let remainingAmount = total;

      // توزيع الأقساط على مصفوفة الأشهر الـ 12
      for (let i = 0; i < months; i++) {
        let targetMonth = (currentMonthIndex + i) % 12;
        if (i === months - 1) {
          monthlyDistribution[targetMonth] = remainingAmount; // الشهر الأخير يأخذ باقي الكسور
        } else {
          monthlyDistribution[targetMonth] = monthlyInstallment;
          remainingAmount -= monthlyInstallment;
        }
      }

      // بناء كائن السلفة الجديد
      const newLoan = {
        id: Date.now(),
        name: name,
        total: total,
        remaining: total,
        monthsData: monthlyDistribution
      };

      // جلب البيانات القديمة وإضافة السجِل الجديد في البداية
      let loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
      loans.unshift(newLoan);
      localStorage.setItem("five_caravans_loans", JSON.stringify(loans));

      // تحديث الجدول فوراً وتصفير الفورم
      renderLoansTable();
      loanForm.reset();
    });
  }
});

// دالة عرض وتحديث محتويات جدول السلف السنوي المحدثة تماماً
function renderLoansTable() {
  const tableBody = document.getElementById("loans-table-body");
  if (!tableBody) return; // للتأكد من عدم حدوث خطأ إذا كنا في صفحة أخرى

  const loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];

  if (loans.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="16" class="py-8 text-center text-slate-400 italic bg-white">لا توجد سجلات سلف مالية نشطة حالياً.</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";
  
  loans.forEach(l => {
    let rowHtml = `<tr class="hover:bg-slate-50/80 transition-all border-b border-slate-100">
      <td class="p-3 text-right font-bold text-slate-800 bg-white sticky right-0 z-10 border-l border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">${l.name}</td>`;

    // عرض الأشهر الـ 12 بالترتيب الصحيح (من يناير إلى ديسمبر)
    l.monthsData.forEach(monthVal => {
      if (monthVal === "-") {
        rowHtml += `<td class="p-3 text-slate-300 font-mono">-</td>`;
      } else {
        rowHtml += `<td class="p-3 font-bold text-blue-700 font-mono">${parseFloat(monthVal).toLocaleString('en-US')}</td>`;
      }
    });

    // إضافة خانات المتبقي والإجمالي والعمليات متوافقة مع الألوان الفخمة لديك
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

// دالة تسوية السلفة بالكامل
function settleLoan(id) {
  if (confirm("هل أنت متأكد من تسوية وإغلاق هذه السُلفة بالكامل؟ سيتم تصفير المبلغ المتبقي.")) {
    let loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
    loans = loans.map(l => {
      if (l.id === id) {
        l.remaining = 0;
        l.monthsData = Array(12).fill("-"); // تصفير الأقساط
      }
      return l;
    });
    localStorage.setItem("five_caravans_loans", JSON.stringify(loans));
    renderLoansTable();
  }
}

// دالة حذف القيد نهائياً
function deleteLoan(id) {
  if (confirm("تنبيه: هل أنت متأكد من حذف هذا السجل المالي نهائياً؟")) {
    let loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
    loans = loans.filter(l => l.id !== id);
    localStorage.setItem("five_caravans_loans", JSON.stringify(loans));
    renderLoansTable();
  }
}
