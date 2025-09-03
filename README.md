# OptiNet - Load Balancer Management System

## תיאור הפרויקט
OptiNet הוא מערכת ניהול Load Balancer מתקדמת המאפשרת ניטור בזמן אמת של ביצועי הרשת, ניהול משתמשים, ומעקב אחר סטטיסטיקות ביצועים.

## תכונות עיקריות
- 📊 **Dashboard מתקדם** עם סטטיסטיקות בזמן אמת
- 📈 **עמוד סטטיסטיקות** עם גרפים אינטראקטיביים
- 👥 **ניהול משתמשים** ומשפחות
- 🌐 **ניטור רשת** וראוטרים
- ⚙️ **הגדרות מערכת** עם תמיכה ב-Dark Mode
-  **מערכת אימות** מאובטחת

## דרישות מערכת
- Node.js (גרסה 16 ומעלה)
- npm או yarn
- דפדפן מודרני (Chrome, Firefox, Safari, Edge)

## התקנה והרצה

### 1. שכפול הפרויקט
```bash
git clone <repository-url>
cd OptiNet
```

### 2. התקנת תלויות
```bash
npm install
```

### 3. הרצת האפליקציה
```bash
npm start
```

האפליקציה תיפתח אוטומטית בדפדפן בכתובת: `http://localhost:3000`

### 4. בנייה לייצור
```bash
npm run build
```

## מבנה הפרויקט
```
src/
├── components/          # רכיבים משותפים
├── pages/              # עמודים ראשיים
│   ├── Dashboard.tsx   # לוח הבקרה הראשי
│   ├── Statistics.tsx  # עמוד הסטטיסטיקות
│   ├── Home.tsx        # עמוד הבית
│   └── ...            # עמודים נוספים
├── services/           # שירותים ו-API
├── extra/              # קבצים נוספים
│   └── graph.html      # גרף הסטטיסטיקות
└── App.tsx             # הרכיב הראשי
```

## שימוש באפליקציה

### כניסה ראשונית
1. פתח את האפליקציה בדפדפן
2. השתמש בפרטי הכניסה הבאים:
   - **Email**: `admin@gmail.com`
   - **Password**: `1234`

### ניווט במערכת
- **Dashboard**: לוח הבקרה הראשי עם סטטיסטיקות כלליות
- **Statistics**: עמוד הסטטיסטיקות עם גרפים בזמן אמת
- **My Profile**: ניהול הפרופיל האישי
- **My Family**: ניהול משפחה
- **All Users**: צפייה בכל המשתמשים במערכת
- **Routers**: ניהול ראוטרים
- **Settings**: הגדרות מערכת

### עמוד הסטטיסטיקות
עמוד הסטטיסטיקות מציג גרפים בזמן אמת של ביצועי ה-Load Balancer:
- **נוסחת החישוב**: `Score = (0.6 × LatencyScore) + (0.3 × ClientsScore) + (0.1 × TrafficScore)`
- **עדכון אוטומטי**: הנתונים מתעדכנים כל 2 שניות
- **גישה מהירה**: לחיצה על כרטיס Performance ב-Dashboard

## API Endpoints
האפליקציה מתחברת ל-API הבא:
- **Base URL**: `http://192.168.1.57:5000`
- **Endpoint**: `/neighbors` - לקבלת נתוני ביצועים

## פיתוח

### הרצה בסביבת פיתוח
```bash
npm start
```

### בדיקת קוד
```bash
npm run lint
```

### בנייה לבדיקה
```bash
npm run build
npm run preview
```

## פתרון בעיות נפוצות

### בעיית הרצה
אם האפליקציה לא רצה:
1. ודא ש-Node.js מותקן ומוגדר נכון
2. מחק את תיקיית `node_modules` והרץ `npm install` מחדש
3. בדוק שאין תהליכים אחרים שרצים על פורט 3000

### בעיית חיבור ל-API
אם הגרפים לא מציגים נתונים:
1. ודא שה-API שרץ על `http://192.168.1.57:5000`
2. בדוק שהרשת מאפשרת גישה לכתובת זו
3. בדוק את Console בדפדפן לשגיאות

## תרומה לפרויקט
1. Fork את הפרויקט
2. צור ענף חדש לתכונה: `git checkout -b feature/AmazingFeature`
3. Commit את השינויים: `git commit -m 'Add some AmazingFeature'`
4. Push לענף: `git push origin feature/AmazingFeature`
5. פתח Pull Request

## רישיון
פרויקט זה מוגן תחת רישיון MIT.

## תמיכה
לשאלות ותמיכה טכנית, פנה אל:
- **Email**: [your-email@example.com]
- **Documentation**: [link-to-docs]

---

**הערה**: פרויקט זה פותח עבור מערכת OptiNet לניהול Load Balancer מתקדמת.
