'use client';

import { FormEvent, ReactNode, useMemo, useState } from 'react';
import { CalendarClock, Check, Hash, MessageSquarePlus, Pencil, Pin, Search, Send, Trash2, Vote, X } from 'lucide-react';
import { Badge } from '@/app/warden/Template/components/ui/badge';
import { Button } from '@/app/warden/Template/components/ui/button';
import { Card, CardContent } from '@/app/warden/Template/components/ui/card';
import { Input } from '@/app/warden/Template/components/ui/input';
import { Textarea } from '@/app/warden/Template/components/ui/textarea';

type Status = 'Pending' | 'Approved' | 'Rejected' | 'Forwarded';
type PostType = 'text' | 'poll';
type FeedSection = 'latest' | 'pinned';

interface PollOption {
  text: string;
  votes: number;
}

interface CommunityPost {
  id: number;
  author: string;
  content: string;
  date: string;
  time: string;
  status: Status;
  type: PostType;
  tags: string[];
  pollOptions: PollOption[];
  creatorId: string;
  creatorRole: string;
  hostelName: string;
  pinned?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';
const CURRENT_WARDEN = {
  id: 'mock-warden-id',
  name: 'Warden Office',
  role: 'warden' as const,
  hostelName: 'BWF Hostel',
};

const initialVotedOptions: Record<number, number> = {
  108: 1,
};

const initialPosts: CommunityPost[] = [
  {
    id: 108,
    author: 'Warden Office',
    content: '#Gate Timing Poll#\nMain gate entry timings will be reviewed this week. Vote for the slot that works best for supervised evening entry.',
    date: '2026-05-04',
    time: '18:15',
    status: 'Approved',
    type: 'poll',
    tags: ['#GateTiming', '#HostelSafety', '#WardenUpdate'],
    pollOptions: [
      { text: '8:30 PM', votes: 18 },
      { text: '9:00 PM', votes: 32 },
      { text: '9:30 PM', votes: 24 },
    ],
    creatorId: CURRENT_WARDEN.id,
    creatorRole: 'warden',
    hostelName: CURRENT_WARDEN.hostelName,
    pinned: true,
  },
  {
    id: 107,
    author: 'Nisha Rao',
    content: '#Study Room Lights#\nThe south block study room lights are flickering after 10 PM. Please check before exam week starts.',
    date: '2026-05-04',
    time: '12:40',
    status: 'Approved',
    type: 'text',
    tags: ['#StudyRoom', '#Maintenance'],
    pollOptions: [],
    creatorId: 'student-105',
    creatorRole: 'student',
    hostelName: 'BWF Hostel',
  },
  {
    id: 106,
    author: 'Admin Desk',
    content: '#Document Verification#\nStudents who submitted scholarship documents last week can collect acknowledgement slips from the office after lunch.',
    date: '2026-05-04',
    time: '10:10',
    status: 'Approved',
    type: 'text',
    tags: ['#Scholarship', '#Admin'],
    pollOptions: [],
    creatorId: 'admin-001',
    creatorRole: 'admin',
    hostelName: 'BWF Hostel',
    pinned: true,
  },
  {
    id: 105,
    author: 'Warden Office',
    content: '#Water Tank Cleaning#\nWater tank cleaning is scheduled for Wednesday morning from 7 AM to 10 AM. Please store only essential water and avoid wastage.',
    date: '2026-05-03',
    time: '19:05',
    status: 'Approved',
    type: 'text',
    tags: ['#Maintenance', '#WaterSupply'],
    pollOptions: [],
    creatorId: CURRENT_WARDEN.id,
    creatorRole: 'warden',
    hostelName: CURRENT_WARDEN.hostelName,
    pinned: true,
  },
  {
    id: 104,
    author: 'Aman Verma',
    content: '#Library Hours#\nCan we extend library room access during the scholarship application week?',
    date: '2026-05-03',
    time: '11:30',
    status: 'Approved',
    type: 'poll',
    tags: ['#Library', '#Scholarship'],
    pollOptions: [
      { text: 'Extend till 10 PM', votes: 22 },
      { text: 'Keep current time', votes: 7 },
    ],
    creatorId: 'student-103',
    creatorRole: 'student',
    hostelName: 'BWF Hostel',
  },
  {
    id: 103,
    author: 'Activity Coordinator',
    content: '#Weekend Practice#\nMusic room practice slots are open for the cultural evening team. Please keep instruments back in the labelled shelves.',
    date: '2026-05-02',
    time: '18:30',
    status: 'Approved',
    type: 'text',
    tags: ['#Activities', '#MusicRoom'],
    pollOptions: [],
    creatorId: 'staff-activity-01',
    creatorRole: 'staff',
    hostelName: 'BWF Hostel',
  },
  {
    id: 102,
    author: 'Ritika Sharma',
    content: '#Health Camp Feedback#\nHi, my name is #Pratham Tiwari#. I am new here and want to contribute to #BWF#. Thanks to the wardens for arranging the health camp.',
    date: '2026-05-02',
    time: '16:10',
    status: 'Approved',
    type: 'text',
    tags: ['#HealthCamp', '#Community'],
    pollOptions: [],
    creatorId: 'student-102',
    creatorRole: 'student',
    hostelName: 'BWF Hostel',
  },
  {
    id: 101,
    author: 'Karan Mehta',
    content: '#Common Room Request#\nCan the common room projector be checked before the weekend documentary screening?',
    date: '2026-05-02',
    time: '10:25',
    status: 'Approved',
    type: 'text',
    tags: ['#CommonRoom', '#Weekend'],
    pollOptions: [],
    creatorId: 'student-101',
    creatorRole: 'student',
    hostelName: 'BWF Hostel',
  },
  {
    id: 100,
    author: 'Warden Office',
    content: '#Corridor Safety#\nReminder: keep corridors clear for emergency access. Shoes, cartons, and cycle parts left outside rooms will be moved to storage after inspection.',
    date: '2026-05-01',
    time: '09:20',
    status: 'Approved',
    type: 'text',
    tags: ['#Safety', '#HostelRules'],
    pollOptions: [],
    creatorId: CURRENT_WARDEN.id,
    creatorRole: 'warden',
    hostelName: CURRENT_WARDEN.hostelName,
    pinned: true,
  },
];

const avatarColors = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-cyan-100 text-cyan-700',
  'bg-lime-100 text-lime-700',
  'bg-fuchsia-100 text-fuchsia-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
];

const toDisplayDate = (post: CommunityPost) =>
  new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(`${post.date}T${post.time}`)
  );

const totalVotes = (post: CommunityPost) => post.pollOptions.reduce((sum, option) => sum + option.votes, 0);
const initialFor = (name: string) => name.trim().charAt(0).toUpperCase() || 'W';

const avatarColorFor = (seed: string | number) => {
  const value = String(seed);
  const hash = Array.from(value).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);
  return avatarColors[hash % avatarColors.length];
};

const normalizeTag = (value: string) => {
  const compact = value.trim().replace(/^#/, '').replace(/\s+/g, '');
  return compact ? `#${compact}` : '';
};

const tagsToInput = (tags: string[]) => tags.map((tag) => tag.replace(/^#/, '')).join(', ');

const renderInlineContent = (line: string) => {
  return line.split(/(#.+?#)/g).map((part, index) => {
    const boldText = part.match(/^#(.+?)#$/);

    if (boldText) {
      return (
        <strong key={`${part}-${index}`} className="font-bold text-slate-950">
          {boldText[1].trim()}
        </strong>
      );
    }

    return part;
  });
};

const renderPostContent = (content: string): ReactNode => {
  return content.split('\n').map((line, index) => {
    const heading = line.match(/^#(.+)#$/);

    if (heading) {
      return (
        <h3 key={`${line}-${index}`} className="mb-2 text-base font-bold leading-6 text-slate-950">
          {heading[1].trim()}
        </h3>
      );
    }

    return line.trim() ? (
      <p key={`${line}-${index}`} className="text-sm leading-6 text-slate-700">
        {renderInlineContent(line)}
      </p>
    ) : null;
  });
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [section, setSection] = useState<FeedSection>('latest');
  const [draftType, setDraftType] = useState<PostType>('text');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [pollInputs, setPollInputs] = useState(['', '']);
  const [votedOptions, setVotedOptions] = useState<Record<number, number>>(initialVotedOptions);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingTagInput, setEditingTagInput] = useState('');

  const filteredPosts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return posts
      .filter((post) => post.status === 'Approved' || post.creatorId === CURRENT_WARDEN.id)
      .filter((post) => (section === 'pinned' ? post.pinned : true))
      .filter((post) => {
        if (!query) return true;
        const searchable = `${post.author} ${post.creatorRole} ${post.tags.join(' ')} ${post.content}`.toLowerCase();
        return searchable.includes(query);
      })
      .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());
  }, [posts, searchTerm, section]);

  const buildPostPayload = (): Omit<CommunityPost, 'id'> => {
    const now = new Date();
    const tags = tagInput
      .split(',')
      .map(normalizeTag)
      .filter(Boolean);

    return {
      author: CURRENT_WARDEN.name,
      content: content.trim(),
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      status: 'Pending',
      type: draftType,
      tags,
      pollOptions:
        draftType === 'poll'
          ? pollInputs.map((text) => ({ text: text.trim(), votes: 0 })).filter((option) => option.text)
          : [],
      creatorId: CURRENT_WARDEN.id,
      creatorRole: CURRENT_WARDEN.role,
      hostelName: CURRENT_WARDEN.hostelName,
      pinned: false,
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) return;
    if (draftType === 'poll' && pollInputs.filter((option) => option.trim()).length < 2) return;

    const payload = buildPostPayload();

    // Backend-ready handoff: POST `${API_BASE_URL}/api/community/posts` with this payload when the endpoint is available.
    console.info('Prepared community post payload', { endpoint: `${API_BASE_URL}/api/community/posts`, payload });

    setPosts((current) => [{ ...payload, id: Date.now() }, ...current]);
    setContent('');
    setTagInput('');
    setPollInputs(['', '']);
    setDraftType('text');
    setSection('latest');
  };

  const startEditing = (post: CommunityPost) => {
    setEditingPostId(post.id);
    setEditingContent(post.content);
    setEditingTagInput(tagsToInput(post.tags));
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditingContent('');
    setEditingTagInput('');
  };

  const saveEditing = (postId: number) => {
    if (!editingContent.trim()) return;

    const tags = editingTagInput
      .split(',')
      .map(normalizeTag)
      .filter(Boolean);

    setPosts((current) =>
      current.map((post) =>
        post.id === postId && post.creatorId === CURRENT_WARDEN.id
          ? { ...post, content: editingContent.trim(), tags }
          : post
      )
    );
    cancelEditing();
  };

  const deletePost = (postId: number) => {
    setPosts((current) => current.filter((post) => post.id !== postId || post.creatorId !== CURRENT_WARDEN.id));
    if (editingPostId === postId) cancelEditing();
  };

  const handleVote = (postId: number, optionIndex: number) => {
    const previousOptionIndex = votedOptions[postId];
    if (previousOptionIndex === optionIndex) return;

    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          pollOptions: post.pollOptions.map((option, index) => {
            if (index === optionIndex) return { ...option, votes: option.votes + 1 };
            if (index === previousOptionIndex) return { ...option, votes: Math.max(0, option.votes - 1) };
            return option;
          }),
        };
      })
    );
    setVotedOptions((current) => ({ ...current, [postId]: optionIndex }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:px-6 lg:px-8">
        <div className="sticky top-14 z-30 -mx-4 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name or #hashtag"
              className="h-11 w-full rounded-xl border-slate-200 bg-white pl-11 text-sm shadow-sm"
            />
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px] 2xl:grid-cols-[minmax(0,1fr)_350px]">
          <section className="order-2 min-w-0 space-y-4 xl:order-1">
            <div className="space-y-2">
              <h2 className="text-lg font-bold tracking-tight text-slate-950">Your Feed</h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSection('latest')}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${section === 'latest' ? 'border-blue-100 bg-blue-50 text-blue-700 shadow-sm' : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-950'}`}
                >
                  Latest
                </button>
                <button
                  type="button"
                  onClick={() => setSection('pinned')}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${section === 'pinned' ? 'border-blue-100 bg-blue-50 text-blue-700 shadow-sm' : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-950'}`}
                >
                  Pinned
                </button>
              </div>
            </div>

            <div className="space-y-4 pb-6">
              {filteredPosts.length === 0 ? (
                <Card className="border-dashed border-slate-300 bg-white shadow-sm">
                  <CardContent className="flex min-h-48 flex-col items-center justify-center text-center">
                    <Search className="mb-3 h-8 w-8 text-slate-300" />
                    <p className="font-semibold text-slate-800">No posts found</p>
                    <p className="mt-1 text-sm text-slate-500">Try another name or hashtag.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredPosts.map((post) => {
                  const votes = totalVotes(post);
                  const isOwnPost = post.creatorId === CURRENT_WARDEN.id;
                  const isEditing = editingPostId === post.id;

                  return (
                    <article key={post.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md md:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarColorFor(`${post.author}-${post.id}`)}`}>
                            {initialFor(post.author)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="truncate text-sm font-bold text-slate-950">{post.author}</h2>
                              {post.pinned && (
                                <Badge className="gap-1 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50">
                                  <Pin className="h-3 w-3" /> Pinned
                                </Badge>
                              )}
                            </div>
                            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              <CalendarClock className="h-3.5 w-3.5" />
                              {toDisplayDate(post)} at {post.time} | {post.hostelName}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Badge variant="outline" className="border-blue-100 bg-blue-50 text-blue-700 capitalize">
                            {post.creatorRole}
                          </Badge>
                          {isOwnPost && !isEditing && (
                            <div className="flex items-center gap-1">
                              <Button type="button" variant="ghost" size="icon" onClick={() => startEditing(post)} className="h-8 w-8 text-slate-500 hover:text-blue-700">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button type="button" variant="ghost" size="icon" onClick={() => deletePost(post.id)} className="h-8 w-8 text-slate-500 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="mt-5 space-y-3 rounded-xl border border-blue-100 bg-blue-50/40 p-3">
                          <Textarea
                            value={editingContent}
                            onChange={(event) => setEditingContent(event.target.value)}
                            className="min-h-28 resize-none rounded-lg border-slate-200 bg-white text-sm leading-6"
                          />
                          <div className="relative">
                            <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              value={editingTagInput}
                              onChange={(event) => setEditingTagInput(event.target.value)}
                              placeholder="Tags separated by commas"
                              className="h-10 rounded-lg border-slate-200 bg-white pl-10 text-sm"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={cancelEditing} className="h-9 gap-2">
                              <X className="h-4 w-4" /> Cancel
                            </Button>
                            <Button type="button" onClick={() => saveEditing(post.id)} className="h-9 gap-2 bg-blue-700 text-white hover:bg-blue-800">
                              <Check className="h-4 w-4" /> Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-5 space-y-2">{renderPostContent(post.content)}</div>
                      )}

                      {!isEditing && post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => setSearchTerm(tag)}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}

                      {!isEditing && post.type === 'poll' && (
                        <div className="mt-5 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <span className="flex items-center gap-2"><Vote className="h-4 w-4 text-blue-600" /> Vote</span>
                            <span>{votedOptions[post.id] !== undefined ? 'Your vote is recorded. You can change it.' : `${votes} total votes`}</span>
                          </div>
                          {post.pollOptions.map((option, index) => {
                            const percent = votes ? Math.round((option.votes / votes) * 100) : 0;
                            const hasVoted = votedOptions[post.id] !== undefined;
                            const selected = votedOptions[post.id] === index;

                            return (
                              <button
                                key={option.text}
                                type="button"
                                onClick={() => handleVote(post.id, index)}
                                aria-pressed={selected}
                                className={`w-full rounded-lg border bg-white p-3 text-left transition ${selected ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-200'} ${hasVoted && !selected ? 'opacity-90' : ''}`}
                              >
                                <div className="flex items-center justify-between gap-3 text-sm font-medium text-slate-800">
                                  <span>{option.text}</span>
                                  <span>{percent}%</span>
                                </div>
                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${percent}%` }} />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </section>

          <aside className="order-1 xl:order-2 xl:sticky xl:top-28 xl:self-start">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-3 md:p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
                      <MessageSquarePlus className="h-4 w-4" /> Warden Post
                    </p>
                    <h2 className="mt-1 text-base font-bold text-slate-950">Create post</h2>
                  </div>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${avatarColorFor(CURRENT_WARDEN.id)}`}>
                    {initialFor(CURRENT_WARDEN.name)}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-100 p-1 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setDraftType('text')}
                      className={`rounded-md px-3 py-2 transition ${draftType === 'text' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
                    >
                      Text
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraftType('poll')}
                      className={`rounded-md px-3 py-2 transition ${draftType === 'poll' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
                    >
                      Poll
                    </button>
                  </div>

                  <Textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Use #Heading# on its own line for bold heading text."
                    className="min-h-24 resize-none rounded-lg border-slate-200 bg-slate-50 text-sm leading-6 md:min-h-28"
                  />

                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      placeholder="Tags separated by commas"
                      className="h-10 rounded-lg border-slate-200 bg-slate-50 pl-10 text-sm"
                    />
                  </div>

                  {draftType === 'poll' && (
                    <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      {pollInputs.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(event) => setPollInputs((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}
                            placeholder={`Option ${index + 1}`}
                            className="h-9 rounded-lg bg-white text-sm"
                          />
                          {pollInputs.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setPollInputs((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                              className="h-9 w-9 shrink-0 text-slate-500 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {pollInputs.length < 4 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setPollInputs((current) => [...current, ''])}
                          className="h-9 w-full border-dashed text-xs"
                        >
                          Add option
                        </Button>
                      )}
                    </div>
                  )}

                  <Button type="submit" className="h-10 w-full gap-2 bg-blue-700 text-white hover:bg-blue-800">
                    <Send className="h-4 w-4" />
                    Publish as warden
                  </Button>
                </form>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
