import {
    Youtube,
    LightbulbIcon,
    MessageCircleIcon,
    CodeIcon,
    FileTextIcon,
    BookOpenIcon,
    ListTodoIcon,
    BrainIcon,
    ShuffleIcon,
    MusicIcon,
    PaletteIcon,
    QuoteIcon,
    NotebookIcon,
    BookmarkIcon,
    CalendarIcon,
    GlobeIcon,
    NewspaperIcon,
    StarIcon,
    SettingsIcon,
    FolderIcon,
    CaseSensitive,
    Calendar,
    X,
    ListTodo,
    CalendarSearch,
} from 'lucide-react';

export const Icons = [
    { name: 'youtube', icon: Youtube },
    { name: 'idea', icon: LightbulbIcon },
    { name: 'post', icon: MessageCircleIcon },
    { name: 'programming', icon: CodeIcon },
    { name: 'article', icon: FileTextIcon },
    { name: 'learn', icon: BookOpenIcon },
    { name: 'todo', icon: ListTodoIcon },
    { name: 'thought', icon: BrainIcon },
    { name: 'random', icon: ShuffleIcon },
    { name: 'music', icon: MusicIcon },
    { name: 'art', icon: PaletteIcon },
    { name: 'quote', icon: QuoteIcon },
    { name: 'notes', icon: NotebookIcon },
    { name: 'bookmark', icon: BookmarkIcon },
    { name: 'calendar', icon: CalendarIcon },
    { name: 'world', icon: GlobeIcon },
    { name: 'news', icon: NewspaperIcon },
    { name: 'favorite', icon: StarIcon },
    { name: 'settings', icon: SettingsIcon },
    { name: 'folder', icon: FolderIcon },
];

export const Colors = ["default", "secondary", "primary", "success", "warning", "danger"];

export const OrderBy = [
    {
        key: '',
        value: 'None',
        icon: X,
    },
    {
        key: 'name',
        value: 'Name',
        icon: CaseSensitive,
    },
    {
        key: 'createdAt',
        value: 'Created',
        icon: Calendar,
    },
    {
        key: 'updatedAt',
        value: 'Updated',
        icon: CaseSensitive,
    }
]

export const OrderByTask = [
    {
        key: '',
        value: 'None',
        icon: X,
    },
    {
        key: 'content',
        value: 'Text',
        icon: CaseSensitive,
    },
    {
        key: 'done',
        value: 'Status',
        icon: ListTodo,
    },
    {
        key: 'createdAt',
        value: 'Created',
        icon: Calendar,
    },
    {
        key: 'updatedAt',
        value: 'Updated',
        icon: CalendarSearch,
    }
]