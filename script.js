// ==========================================
// كود لوحة التحكم العامة - إدارة الحركات المباشرة
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    // عرض الجدول عند تحميل الصفحة
    renderDashboardTable();

    // ربط نموذج إضافة حركة جديدة
    const inputForm = document.getElementById("dashboard-input-form");
    if (inputForm) {
        inputForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const empNameInput = document.getElementById("dashboard-emp-name");
            const actionTypeInput = document.getElementById("dashboard-action-type");
            const statusInput = document.getElementById("dashboard-status");

            const empName = empNameInput ? empNameInput.value.trim() : "";
            const actionType = actionTypeInput ? actionTypeInput.value : "-";
            const status = statusInput ? statusInput.value : "قيد الانتظار";

            if (!empName) {
                alert("الرجاء إدخال اسم الموظف");
                return;
            }

            // التوقيت الحالي بتنسيق عربي واضحة
            const currentDateTime = new Date().toLocaleString('ar-SA', { hour12: true });

            const newRecord = {
                id: Date.now(),
                name: empName,
                type: actionType,
                date: currentDateTime,
                status: status
            };

            let records = getDashboardRecords();
            records.unshift(newRecord);
            saveDashboardRecords(records);

            renderDashboardTable();
            inputForm.reset();
        });
    }
});

// دالة مساعدة لجلب السجلات بأمان ومنع undefined
function getDashboardRecords() {
    try {
        const rawData = localStorage.getItem("dashboard_records");
        return rawData ? JSON.parse(rawData) : [];
    } catch (e) {
        console.error("خطأ في قراءة بيانات لوحة التحكم:", e);
        return [];
    }
}

// دالة مساعدة لحفظ السجلات
function saveDashboardRecords(records) {
    localStorage.setItem("dashboard_records", JSON.stringify(records));
}

// دالة عرض جدول الحركات المباشرة
function renderDashboardTable() {
    const tableBody = document.getElementById("dashboard-table-body");
    if (!tableBody) return; // حماية في حال كانت الصفحة مختلفة

    const records = getDashboardRecords();

    if (records.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-400">لا توجد حركات مسجلة اليوم.</td></tr>`;
        return;
    }

    tableBody.innerHTML = "";
    records.forEach(r => {
        // صمامات أمان حركية لمنع ظهور undefined
        const safeName = r.name || 'بدون اسم';
        const safeType = r.type || '-';
        const safeDate = r.date || '-';
        const safeStatus = r.status || 'قيد الانتظار';

        // تحديد لون الحالة
        const isApproved = safeStatus === 'تمت الموافقة' || safeStatus === 'مكتمل';
        const statusBadgeClass = isApproved 
            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
            : 'bg-amber-100 text-amber-700 border border-amber-200';

        tableBody.innerHTML += `
            <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors text-right">
                <td class="p-3 font-bold text-slate-800">${safeName}</td>
                <td class="p-3 text-slate-600">${safeType}</td>
                <td class="p-3 text-slate-500 font-mono text-xs" dir="ltr">${safeDate}</td>
                <td class="p-3">
                    <span class="px-2.5 py-1 rounded-md text-xs font-bold inline-block ${statusBadgeClass}">
                        ${safeStatus}
                    </span>
                </td>
                <td class="p-3 text-center">
                    <button onclick="deleteDashboardRecord(${r.id})" class="text-red-500 hover:text-red-700 hover:underline font-bold text-xs transition-all">
                        حذف
                    </button>
                </td>
            </tr>`;
    });
}

// دالة حذف حركة معينة
function deleteDashboardRecord(id) {
    if (confirm("هل تريد حذف هذا الإجراء؟")) {
        let records = getDashboardRecords();
        records = records.filter(r => r.id !== id);
        saveDashboardRecords(records);
        renderDashboardTable();
    }
}

// ==========================================
// أدوات معالجة تواريخ وحقول الإكسل (Excel Helper)
// ==========================================

function convertExcelDate(excelDate) {
    if (excelDate === null || excelDate === undefined || excelDate === '') {
        return '-';
    }

    // التحقق مما إذا كانت القيمة رقماً تسلسلياً خاصاً بإكسل
    const num = Number(excelDate);
    if (!isNaN(num) && num > 0) {
        // تحويل أرقام تاريخ إكسل التسلسلية مع ضبط الأيام والتوقيت
        const date = new Date((num - 25569) * 86400 * 1000);
        
        // تصحيح فارق المنطقة الزمنية (Timezone correction)
        const userOffset = date.getTimezoneOffset() * 60000;
        const correctedDate = new Date(date.getTime() + userOffset);

        const year = correctedDate.getFullYear();
        const month = String(correctedDate.getMonth() + 1).padStart(2, '0');
        const day = String(correctedDate.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

    // إرجاع القيمة كما هي إذا كانت نصاً مدرجاً مسبقاً
    return String(excelDate).trim();
}

// ==========================================
// مثال عملي لمعالجة الصفوف أثناء حلقة الاستيراد
// ==========================================
function processImportedRow(row) {
    let joiningDateRaw = row['تاريخ الالتحاق'] || row['تاريخ الانضمام'] || row['تاريخ التعيين'];
    let formattedDate = convertExcelDate(joiningDateRaw);

    return {
        name: row['الاسم'] || row['اسم الموظف'] || 'بدون اسم',
        joiningDate: formattedDate,
        role: row['المسمى الوظيفي'] || row['الوظيفة'] || '-'
    };
}
