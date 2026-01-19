// دۆکیومێنت ئامادەیە
document.addEventListener('DOMContentLoaded', function() {
    // وەرگرتنی نوێترین چالاکییەکان
    fetchRecentActivities();
    
    // دروستکردنی رووکاری تەختەی شەترەنج
    createChessBoard();
});

// فەنکشنی وەرگرتنی نوێترین چالاکییەکان لە سێرڤەر
function fetchRecentActivities() {
    // بەکارهێنانی AJAX بۆ وەرگرتنی داتا لە PHP
    fetch('php/get_recent_activities.php')
        .then(response => response.json())
        .then(data => {
            displayActivities(data);
        })
        .catch(error => {
            console.error('هەڵە لە کاتی وەرگرتنی چالاکییەکان:', error);
            // نیشاندانی چەند چالاکییەکی نموونەیی لە کاتی هەڵەدا
            displaySampleActivities();
        });
}

// فەنکشنی نیشاندانی چالاکییەکان لە پەیجەکە
function displayActivities(activities) {
    const activitiesContainer = document.getElementById('recent-activities');
    
    // چۆڵکردنی ناوەڕۆکی کۆنتەینەر
    activitiesContainer.innerHTML = '';
    
    if (activities.length === 0) {
        activitiesContainer.innerHTML = '<p class="no-activities">هیچ چالاکییەک نەدۆزرایەوە</p>';
        return;
    }
    
    // زیادکردنی چالاکییەکان
    activities.forEach(activity => {
        const activityCard = document.createElement('div');
        activityCard.className = 'activity-card';
        
        activityCard.innerHTML = `
            <img src="${activity.image || '../images/default-activity.jpg'}" alt="${activity.title}" class="activity-image">
            <div class="activity-content">
                <h3>${activity.title}</h3>
                <p>${activity.description.substring(0, 100)}${activity.description.length > 100 ? '...' : ''}</p>
                <div class="activity-date">
                    <i class="far fa-calendar-alt"></i>
                    ${formatDate(activity.date)}
                </div>
            </div>
        `;
        
        activitiesContainer.appendChild(activityCard);
    });
}

// فەنکشنی نیشاندانی چالاکی نموونەیی لە کاتی نەبوونی داتابەیس
function displaySampleActivities() {
    const sampleActivities = [
        {
            title: 'خولی فێرکاری شەترەنج بۆ منداڵان',
            description: 'ئەکادێمیای شەترەنجی هەولێر خولێکی تایبەت بۆ منداڵانی تەمەن 6-12 ساڵ دەکاتەوە بۆ فێربوونی بنەماکانی شەترەنج.',
            image: '../images/sample-activity1.jpg',
            date: '2025-04-10'
        },
        {
            title: 'پۆلەکانی ئاستی پێشکەوتوو',
            description: 'باشترین مامۆستایانی نێودەوڵەتی وانە بە یاریزانانی ئاستی پێشکەوتوو دەڵێنەوە.',
            image: '../images/sample-activity2.jpg',
            date: '2025-04-05'
        },
        {
            title: 'کێبڕکێی نێوخۆیی ئەکادێمیا',
            description: 'کێبڕکێی نێوخۆیی ئەکادێمیای شەترەنجی هەولێر بۆ هەموو ئەندامەکان دەستی پێکرد.',
            image: '../images/sample-activity3.jpg',
            date: '2025-03-28'
        }
    ];
    
    displayActivities(sampleActivities);
}

// فەنکشنی فۆرماتکردنی بەروار
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ku-IQ', options);
}

// فەنکشنی دروستکردنی تەختەی شەترەنج بۆ بەشی "دەربارەی ئێمە"
function createChessBoard() {
    const boardContainer = document.querySelector('.board-container');
    if (!boardContainer) return;
    
    // تەختە پێشتر دروستکراوە لە CSS
    // دەتوانین هەندێک پارچەی شەترەنج زیاد بکەین بۆ ڕازاندنەوە
    
    // وەک نموونە زیادکردنی کنیگ (شا)
    const king = document.createElement('div');
    king.className = 'chess-piece king';
    king.style.position = 'absolute';
    king.style.top = '50%';
    king.style.left = '50%';
    king.style.transform = 'translate(-50%, -50%)';
    king.style.width = '60px';
    king.style.height = '60px';
    king.style.backgroundImage = 'url("../images/king.png")';
    king.style.backgroundSize = 'contain';
    king.style.backgroundRepeat = 'no-repeat';
    king.style.zIndex = '10';
    
    boardContainer.appendChild(king);
}