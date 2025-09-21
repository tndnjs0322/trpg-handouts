import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import 'tui-date-picker/dist/tui-date-picker.min.css';
import 'tui-time-picker/dist/tui-time-picker.min.css';
import './main.css';

import Calendar from '@toast-ui/calendar';

const el = document.getElementById('calendar');
let compact = (document.documentElement.dataset.compact === '1');

const calendars = [
  { id:'personal', name:'개인',     backgroundColor:'#22c55e', borderColor:'#22c55e' },
  { id:'project',  name:'프로젝트', backgroundColor:'#3b82f6', borderColor:'#3b82f6' },
  { id:'deadline', name:'마감',     backgroundColor:'#ef4444', borderColor:'#ef4444' }
];

const cal = new Calendar(el, {
  defaultView: 'month',
  isReadOnly: false,
  usageStatistics: false,
  calendars,
  useFormPopup: true,
  useDetailPopup: true,
  month: { gridSelection: { enableClick: true, enableDbClick: true }, isAlways6Week:true, startDayOfWeek:1, narrowWeekend:true, visibleEventCount: compact ? 3 : 5 },
  week:  { gridSelection: { enableClick: true, enableDbClick: true }, workweek:true, narrowWeekend:true, showNowIndicator:true, hourStart: compact ? 9 : 8, hourEnd: compact ? 19 : 21 },
  day:   { gridSelection: { enableClick: true, enableDbClick: true } }
});

// 로컬 저장
const KEY='toastui_v2_events';
const load = ()=>{ try{ return JSON.parse(localStorage.getItem(KEY)||'[]')||[] }catch(_){ return [] } };
let state = load(); if (state.length) cal.createEvents(state);
const save=()=>localStorage.setItem(KEY, JSON.stringify(state));
const upsert=(ev)=>{ const i=state.findIndex(x=>x.id===ev.id&&x.calendarId===ev.calendarId); if(i>=0)state[i]={...state[i],...ev}; else state.push(ev); save(); };
const remove=(id,calId)=>{ state=state.filter(x=>!(x.id===id&&x.calendarId===calId)); save(); };

// “선택한 칸”에서 바로 폼 팝업
cal.on('selectDateTime', (ev) => {
  cal.openFormPopup({
    title: '',
    start: ev.start,
    end: ev.end,
    isAllday: !!ev.isAllday,
    calendarId: 'personal'
  });
});

// CRUD
cal.on('beforeCreateEvent', (ev) => {
  const id = String(Date.now()) + Math.random().toString(36).slice(2,7);
  const newEvent = {
    id, calendarId: ev.calendarId || 'personal',
    title: ev.title || '새 일정',
    start: ev.start, end: ev.end,
    isAllday: !!ev.isAllday,
    category: ev.isAllday ? 'allday' : 'time',
    location: ev.location || ''
  };
  cal.createEvents([newEvent]); upsert(newEvent);
});
cal.on('beforeUpdateEvent', ({ event, changes }) => {
  cal.updateEvent(event.id, event.calendarId, changes);
  upsert({ ...event, ...changes });
});
cal.on('beforeDeleteEvent', ({ id, calendarId }) => {
  cal.deleteEvent(id, calendarId); remove(id, calendarId);
});

// 툴바
const $ = id => document.getElementById(id);
const fmt=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const range=()=>{ const s=cal.getDateRangeStart(),e=cal.getDateRangeEnd(); $('range').textContent=`${fmt(s)} ~ ${fmt(e)}`; };
range();

$('btnPrev').onclick = ()=>{ cal.prev();  range(); };
$('btnToday').onclick= ()=>{ cal.today(); range(); };
$('btnNext').onclick = ()=>{ cal.next();  range(); };
document.querySelectorAll('button[data-view]').forEach(b=>b.onclick=()=>{ cal.changeView(b.dataset.view); range(); });

$('btnTheme').onclick=()=>{
  const next=(document.documentElement.dataset.theme==='light')?'dark':'light';
  document.documentElement.dataset.theme=next; cal.render?.();
  $('btnTheme').textContent = (next==='light')?'다크로':'라이트로';
};
$('btnDensity').onclick=()=>{
  const on = document.documentElement.dataset.compact !== '1';
  document.documentElement.dataset.compact = on ? '1' : '0';
  cal.setOptions?.({
    month:{ visibleEventCount: on ? 3 : 5 },
    week:{ hourStart: on ? 9 : 8, hourEnd: on ? 19 : 21 }
  });
  cal.render?.();
  $('btnDensity').textContent = on ? '컴팩트 끄기' : '컴팩트 켜기';
};
$('btnAdd').onclick=()=>{
  const now=new Date();
  cal.openFormPopup({ title:'', start: now, end: new Date(now.getTime()+60*60*1000), isAllday:false, calendarId:'personal' });
};

$('btnHome').onclick=(e)=>{ e.preventDefault(); location.href='../'; };
$('btnBack').onclick=()=>{ history.length>1 ? history.back() : (location.href='../'); };

const safe=()=>{ try{ cal.render(); }catch(_){} };
addEventListener('load', safe); new ResizeObserver(safe).observe(el);

// 데모 일정(처음만)
if (!state.length){
  const now=new Date();
  const demo={ id:'demo', calendarId:'personal', title:'예시 일정',
    start:new Date(now.getFullYear(),now.getMonth(),now.getDate(),10),
    end:new Date(now.getFullYear(),now.getMonth(),now.getDate(),11),
    category:'time' };
  cal.createEvents([demo]); state = load().concat([demo]); save();
}
