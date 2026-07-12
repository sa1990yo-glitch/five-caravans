// أضف هذا السطر داخل الـ DOMContentLoaded بالملف لضمان تشغيل الجدول فور فتح الصفحة
if (document.getElementById("loans-table-body")) renderLoansTable();

// معالجة نموذج إدخال السلف المالية الجديدة وحساب القسط تلقائياً
const loanForm = document.getElementById("loan-input-form");
if (loanForm) {
  loanForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("loan-emp-name").value.trim();
    const total = parseFloat(document.getElementById("loan-total-amount").value);
    const months = parseInt(document.getElementById("loan-months").value);
    const date = new Date().toLocaleDateString('ar-SA');
    
    // حساب القسط الشهري
    const monthlyInstallment = (total / months).toFixed(2);

    const newLoan = { id: Date.now(), name: name, total: total, months: months, monthly: monthlyInstallment, date: date };
    let loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
    loans.unshift(newLoan);
    localStorage.setItem("five_caravans_loans", JSON.stringify(loans));

    renderLoansTable();
    loanForm.reset();
  });
}

// دالة عرض جدول السلف والأقساط المحدث
function renderLoansTable() {
  const tableBody = document.getElementById("loans-table-body");
  if (!tableBody) return;
  const loans = JSON.parse(localStorage.getItem("five_caravans_loans")) || [];
  tableBody.innerHTML = loans.length === 0 ? `<tr><td colspan="6" class="py-4 text-center text-gray-400 italic">لا توجد سجلات سلف مالية حتى الآن.</td></tr>` : "";

  loans.forEach(l => {
    tableBody.innerHTML += `
      <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-all">
        <td class="py-3 font-bold text-gray-800">${l.name}</td>
        <td class="py-3 text-blue-700 font-bold">${l.total} ريال</td>
        <td class="py-3 text-gray-500">${l.months} أشهر</td>
        <td class="py-3 text-emerald-600 font-bold bg-emerald-50/50 rounded-md px-2">${l.monthly} ريال/شهر</td>
        <td class="py-3 text-gray-400 font-mono">${l.date}</td>
        <td class="py-3 text-center"><button onclick="deleteItem(${l.id}, 'five_caravans_loans', renderLoansTable)" class="text-red-500 hover:underline font-bold">تسوية</button></td>
      </tr>`;
  });
}
