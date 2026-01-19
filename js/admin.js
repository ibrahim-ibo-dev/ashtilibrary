/**
 * admin.js - سکریپتی بەڕێوەبردنی پەیجی ئەدمینی ئەکادێمیای شەترەنجی هەولێر
 */

// دڵنیابوون لە ئەوەی بەکارهێنەر داخڵی سیستەم بووە
document.addEventListener('DOMContentLoaded', function() {
    // چێککردنی سێشنی بەکارهێنەر
    checkUserSession();
    
    // دانانی ئیڤێنتەکانی تابەکان
    setupTabEvents();
    
    // وەرگرتنی داتای داشبۆرد
    loadDashboardData();
    
    // دانانی ئیڤێنتەکانی چالاکییەکان
    setupActivityEvents();
    
    // وەرگرتنی هەموو چالاکییەکان
    loadAllActivities();
});

/**
 * چێککردنی سێشنی بەکارهێنەر
 */
function checkUserSession() {
    fetch('../php/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                // بەکارهێنەر داخڵی سیستەم نەبووە، گواستنەوە بۆ پەیجی لۆگین
                window.location.href = '../admin_login.html';
                return;
            }
            
            // نیشاندانی ناوی تەواوی بەکارهێنەر
            document.getElementById('user-fullname').textContent = data.fullname || 'ئەدمین';
        })
        .catch(error => {
            console.error('هەڵە لە کاتی پشکنینی سێشن:', error);
            // لە کاتی هەڵەدا، گواستنەوە بۆ پەیجی لۆگین
            window.location.href = '../admin_login.html';
        });
}

/**
 * دانانی ئیڤێنتەکان بۆ تابەکان
 */
function setupTabEvents() {
    const menuItems = document.querySelectorAll('.menu-item[data-tab]');
    const contentTabs = document.querySelectorAll('.content-tab');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // لابردنی چالاکی لە هەموو ئایتمەکان
            menuItems.forEach(menuItem => menuItem.classList.remove('active'));
            
            // لابردنی چالاکی لە هەموو تابەکان
            contentTabs.forEach(tab => tab.classList.remove('active'));
            
            // زیادکردنی چالاکی بۆ ئایتەمی کلیک لێکراو
            this.classList.add('active');
            
            // زیادکردنی چالاکی بۆ تابی هەڵبژێردراو
            const tabId = `${this.dataset.tab}-tab`;
            document.getElementById(tabId).classList.add('active');
            
            // ئەگەر تابی چالاکییەکان بێت، دووبارە باری بکەرەوە
            if (this.dataset.tab === 'activities') {
                loadAllActivities();
            }
        });
    });
}

/**
 * وەرگرتنی داتای داشبۆرد
 */
function loadDashboardData() {
    fetch('../php/get_dashboard_data.php')
        .then(response => response.json())
        .then(data => {
            // نیشاندانی کۆی چالاکییەکان
            document.getElementById('total-activities').textContent = data.total_activities || 0;
            
            // نیشاندانی بەرواری دوایین چالاکی
            document.getElementById('latest-activity-date').textContent = 
                data.latest_activity ? formatDate(data.latest_activity) : 'هیچ چالاکییەک نییە';
            
            // پڕکردنەوەی لیستی دوایین چالاکییەکان
            displayRecentActivities(data.recent_activities || []);
        })
        .catch(error => {
            console.error('هەڵە لە کاتی وەرگرتنی داتای داشبۆرد:', error);
            document.getElementById('total-activities').textContent = 'هەڵە ڕوویدا';
            document.getElementById('latest-activity-date').textContent = 'هەڵە ڕوویدا';
            document.getElementById('recent-activities-list').innerHTML = 
                '<tr><td colspan="3" class="error-data">هەڵەیەک ڕوویدا لە کاتی وەرگرتنی داتاکان</td></tr>';
        });
}

/**
 * نیشاندانی دوایین چالاکییەکان لە داشبۆرد
 */
function displayRecentActivities(activities) {
    const recentActivitiesList = document.getElementById('recent-activities-list');
    recentActivitiesList.innerHTML = '';
    
    if (activities.length === 0) {
        recentActivitiesList.innerHTML = '<tr><td colspan="3" class="no-data">هیچ چالاکییەک بەردەست نییە</td></tr>';
        return;
    }
    
    activities.forEach(activity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="activity-title">${activity.title}</td>
            <td>${formatDate(activity.date)}</td>
            <td>
                <button class="btn btn-sm btn-primary view-activity" data-id="${activity.id}" title="بینین">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-info edit-activity" data-id="${activity.id}" title="دەستکاریکردن">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        
        recentActivitiesList.appendChild(row);
        
        // زیادکردنی ئیڤێنتەکان بۆ دوگمەکان
        row.querySelector('.view-activity').addEventListener('click', function() {
            window.open(`../activities.html?id=${activity.id}`, '_blank');
        });
        
        row.querySelector('.edit-activity').addEventListener('click', function() {
            openActivityModal(activity.id);
        });
    });
}

/**
 * دانانی ئیڤێنتەکان بۆ بەڕێوەبردنی چالاکییەکان
 */
function setupActivityEvents() {
    // دوگمەی زیادکردنی چالاکی نوێ
    document.getElementById('add-activity-btn').addEventListener('click', function() {
        openActivityModal();
    });
    
    // دوگمەی داخستنی مۆدێل
    document.querySelector('.close-modal').addEventListener('click', function() {
        closeActivityModal();
    });
    
    // دوگمەی پاشگەزبوونەوە لە مۆدێل
    document.getElementById('cancel-activity').addEventListener('click', function() {
        closeActivityModal();
    });
    
    // دوگمەی پاشگەزبوونەوە لە سڕینەوە
    document.getElementById('cancel-delete').addEventListener('click', function() {
        closeDeleteModal();
    });
    
    // دوگمەی پشتڕاستکردنەوەی سڕینەوە
    document.getElementById('confirm-delete').addEventListener('click', function() {
        const activityId = this.getAttribute('data-id');
        if (activityId) {
            deleteActivity(activityId);
        }
    });
    
    // دانانی ئیڤێنت بۆ نیشاندانی پێشبینینی وێنە
    const imageInput = document.getElementById('image');
    imageInput.addEventListener('change', function() {
        previewImage(this);
    });
    
    // دانانی ئیڤێنت بۆ ڕاکێشانی وێنە
    const imagePreview = document.getElementById('image-preview');
    
    // دانانی ئیڤێنتەکانی دراگ اند درۆپ
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        imagePreview.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // زیادکردنی کلاسی highlight لە کاتی دراگ کردنی وێنە
    ['dragenter', 'dragover'].forEach(eventName => {
        imagePreview.addEventListener(eventName, function() {
            this.classList.add('highlight');
        }, false);
    });
    
    // لابردنی کلاسی highlight لە کاتی دراگ لیڤ
    ['dragleave', 'drop'].forEach(eventName => {
        imagePreview.addEventListener(eventName, function() {
            this.classList.remove('highlight');
        }, false);
    });
    
    // هەڵگرتنی وێنە لە کاتی دراگ اند درۆپ
    imagePreview.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length) {
            imageInput.files = files;
            previewImage(imageInput);
        }
    }, false);
    
    // دانانی ئیڤێنت بۆ فۆرمی چالاکی
    document.getElementById('activity-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveActivity(this);
    });
}

/**
 * پێشبینینی وێنە پێش ئپلۆدکردن
 */
function previewImage(input) {
    const preview = document.getElementById('preview-image');
    const previewContainer = document.getElementById('image-preview');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            previewContainer.querySelector('p').style.display = 'none';
        };
        
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.src = '';
        preview.style.display = 'none';
        previewContainer.querySelector('p').style.display = 'block';
    }
}

/**
 * وەرگرتنی هەموو چالاکییەکان
 */
function loadAllActivities() {
    const activitiesList = document.getElementById('activities-list');
    activitiesList.innerHTML = '<tr><td colspan="5" class="loading-data">چاوەڕوان بە...</td></tr>';
    
    fetch('../php/get_admin_activities.php')
        .then(response => response.json())
        .then(data => {
            displayAllActivities(data);
        })
        .catch(error => {
            console.error('هەڵە لە کاتی وەرگرتنی چالاکییەکان:', error);
            activitiesList.innerHTML = '<tr><td colspan="5" class="error-data">هەڵەیەک ڕوویدا لە کاتی وەرگرتنی داتاکان</td></tr>';
        });
}

/**
 * نیشاندانی هەموو چالاکییەکان
 */
function displayAllActivities(activities) {
    const activitiesList = document.getElementById('activities-list');
    activitiesList.innerHTML = '';
    
    if (activities.length === 0) {
        activitiesList.innerHTML = '<tr><td colspan="5" class="no-data">هیچ چالاکییەک بەردەست نییە</td></tr>';
        return;
    }
    
    activities.forEach(activity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${activity.image || '../images/default-activity.jpg'}" alt="${activity.title}" class="activity-thumbnail">
            </td>
            <td class="activity-title">${activity.title}</td>
            <td>${formatDate(activity.date)}</td>
            <td>
                ${activity.video_url ? '<i class="fas fa-video text-success"></i> هەیە' : '<i class="fas fa-times text-muted"></i> نییە'}
            </td>
            <td>
                <button class="btn btn-sm btn-primary view-activity" data-id="${activity.id}" title="بینین">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-info edit-activity" data-id="${activity.id}" title="دەستکاریکردن">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-activity" data-id="${activity.id}" title="سڕینەوە">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        activitiesList.appendChild(row);
        
        // زیادکردنی ئیڤێنتەکان بۆ دوگمەکان
        row.querySelector('.view-activity').addEventListener('click', function() {
            window.open(`../activities.html?id=${activity.id}`, '_blank');
        });
        
        row.querySelector('.edit-activity').addEventListener('click', function() {
            openActivityModal(activity.id);
        });
        
        row.querySelector('.delete-activity').addEventListener('click', function() {
            openDeleteModal(activity.id, activity.title);
        });
    });
}

/**
 * کردنەوەی مۆدێلی چالاکی (بۆ زیادکردن یان دەستکاریکردن)
 */
function openActivityModal(activityId = null) {
    // ڕیسێت کردنی فۆرم
    document.getElementById('activity-form').reset();
    document.getElementById('preview-image').style.display = 'none';
    document.getElementById('image-preview').querySelector('p').style.display = 'block';
    
    // دانانی ئایدی چالاکی (0 بۆ زیادکردنی نوێ)
    document.getElementById('activity-id').value = activityId || 0;
    
    // گۆڕینی سەردێڕی مۆدێل
    const modalTitle = document.getElementById('modal-title');
    
    if (activityId) {
        modalTitle.textContent = 'دەستکاریکردنی چالاکی';
        
        // وەرگرتنی زانیاری چالاکی لە داتابەیس
        fetch(`../php/get_activity_details.php?id=${activityId}&admin=1`)
            .then(response => response.json())
            .then(activity => {
                if (activity) {
                    // پڕکردنەوەی فۆرم بە زانیارییەکانی چالاکی
                    document.getElementById('title').value = activity.title || '';
                    document.getElementById('description').value = activity.description || '';
                    document.getElementById('date').value = activity.date || '';
                    document.getElementById('video_url').value = activity.video_url || '';
                    
                    // نیشاندانی وێنەی ئێستا ئەگەر هەبێت
                    if (activity.image) {
                        const preview = document.getElementById('preview-image');
                        preview.src = activity.image;
                        preview.style.display = 'block';
                        document.getElementById('image-preview').querySelector('p').style.display = 'none';
                    }
                }
            })
            .catch(error => {
                console.error('هەڵە لە کاتی وەرگرتنی زانیاری چالاکی:', error);
                alert('هەڵەیەک ڕوویدا لە کاتی وەرگرتنی زانیاری چالاکی');
                closeActivityModal();
            });
    } else {
        modalTitle.textContent = 'زیادکردنی چالاکی نوێ';
        
        // دانانی بەرواری ئەمڕۆ
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }
    
    // نیشاندانی مۆدێل
    document.getElementById('activity-modal').style.display = 'block';
}

/**
 * داخستنی مۆدێلی چالاکی
 */
function closeActivityModal() {
    document.getElementById('activity-modal').style.display = 'none';
}

/**
 * کردنەوەی مۆدێلی دڵنیابوونەوە لە سڕینەوە
 */
function openDeleteModal(activityId, activityTitle) {
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    confirmDeleteBtn.setAttribute('data-id', activityId);
    
    // ئەگەر ناونیشانی چالاکی هەبێت، زیادی بکە بۆ نامەی پشتڕاستکردنەوە
    if (activityTitle) {
        document.querySelector('#confirm-delete-modal p:first-of-type').textContent = 
            `ئایا دڵنیای لە سڕینەوەی چالاکی "${activityTitle}"؟`;
    }
    
    // نیشاندانی مۆدێل
    document.getElementById('confirm-delete-modal').style.display = 'block';
}

/**
 * داخستنی مۆدێلی دڵنیابوونەوە لە سڕینەوە
 */
function closeDeleteModal() {
    document.getElementById('confirm-delete-modal').style.display = 'none';
}

/**
 * خەزنکردنی چالاکی (زیادکردن یان دەستکاریکردن)
 */
function saveActivity(form) {
    // دروستکردنی فۆرم داتا بۆ ناردن
    const formData = new FormData(form);
    
    // دیاریکردنی ئۆپەراسیۆن (زیادکردن یان دەستکاریکردن)
    const activityId = formData.get('activity_id');
    const isEdit = activityId && activityId !== '0';
    
    // ناردنی داتا بۆ سێرڤەر
    fetch('../php/save_activity.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // نیشاندانی پەیامی سەرکەوتن
            alert(isEdit ? 'چالاکی بە سەرکەوتوویی دەستکاری کرا' : 'چالاکی نوێ بە سەرکەوتوویی زیاد کرا');
            
            // داخستنی مۆدێل
            closeActivityModal();
            
            // نوێکردنەوەی لیستی چالاکییەکان
            loadAllActivities();
            
            // نوێکردنەوەی داشبۆرد
            loadDashboardData();
        } else {
            // نیشاندانی هەڵە
            alert(data.message || 'هەڵەیەک ڕوویدا لە کاتی خەزنکردنی چالاکی');
        }
    })
    .catch(error => {
        console.error('هەڵە لە کاتی خەزنکردنی چالاکی:', error);
        alert('هەڵەیەک ڕوویدا لە کاتی خەزنکردنی چالاکی');
    });
}

/**
 * سڕینەوەی چالاکی
 */
function deleteActivity(activityId) {
    fetch('../php/delete_activity.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `activity_id=${activityId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // نیشاندانی پەیامی سەرکەوتن
            alert('چالاکی بە سەرکەوتوویی سڕایەوە');
            
            // داخستنی مۆدێل
            closeDeleteModal();
            
            // نوێکردنەوەی لیستی چالاکییەکان
            loadAllActivities();
            
            // نوێکردنەوەی داشبۆرد
            loadDashboardData();
        } else {
            // نیشاندانی هەڵە
            alert(data.message || 'هەڵەیەک ڕوویدا لە کاتی سڕینەوەی چالاکی');
        }
    })
    .catch(error => {
        console.error('هەڵە لە کاتی سڕینەوەی چالاکی:', error);
        alert('هەڵەیەک ڕوویدا لە کاتی سڕینەوەی چالاکی');
    });
}

/**
 * فۆرماتکردنی بەروار بۆ شێوازی کوردی
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    // پارچەکردنی بەروار بۆ ساڵ، مانگ و ڕۆژ
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    
    const year = parts[0];
    const month = parts[1];
    const day = parts[2].split(' ')[0]; // لابردنی کات ئەگەر هەبێت
    
    // دانانی ناوی مانگەکان بە کوردی
    const monthNames = [
        'کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران',
        'تەمووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانوونی یەکەم'
    ];
    
    // ژمارەی مانگ لە 1-12 بەڵام ئیندێکسی لیست لە 0-11ـە
    const monthIndex = parseInt(month) - 1;
    const monthName = monthNames[monthIndex] || month;
    
    // گەڕاندنەوەی بەرواری فۆرماتکراو
    return `${day}ی ${monthName} ${year}`;
}