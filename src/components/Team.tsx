import React, { useState } from 'react';
import { UserPlus, Mail, Phone, Edit, Trash2 } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
}

const initialTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Project Manager',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Developer',
    email: 'jane@example.com',
    phone: '+1 234 567 891',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'Designer',
    email: 'mike@example.com',
    phone: '+1 234 567 892',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=random',
  },
];

interface TeamMemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (member: Omit<TeamMember, 'id'> | TeamMember) => void;
  initialData?: TeamMember | null;
}

const TeamMemberFormModal: React.FC<TeamMemberFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [role, setRole] = useState(initialData?.role || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [avatar, setAvatar] = useState(initialData?.avatar || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !email || !phone) {
      alert('Please fill in all required fields.');
      return;
    }

    const newMember: Omit<TeamMember, 'id'> = {
      name, role, email, phone, avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };

    if (initialData) {
      onSubmit({ ...newMember, id: initialData.id });
    } else {
      onSubmit(newMember);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{initialData ? 'Edit Member' : 'Add New Member'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600"
              required
            />
          </div>
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Avatar URL (Optional)</label>
            <input
              type="text"
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {initialData ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Team: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const handleAddMemberClick = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleEditMemberClick = (member: TeamMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setTeamMembers(teamMembers.filter(member => member.id !== id));
    }
  };

  const handleSaveMember = (member: Omit<TeamMember, 'id'> | TeamMember) => {
    if ('id' in member && editingMember) {
      // Editing existing member
      setTeamMembers(teamMembers.map(m => m.id === member.id ? (member as TeamMember) : m));
    } else {
      // Adding new member
      const newMemberWithId: TeamMember = { ...member as Omit<TeamMember, 'id'>, id: crypto.randomUUID() };
      setTeamMembers([...teamMembers, newMemberWithId]);
    }
    setIsModalOpen(false);
    setEditingMember(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Team Members</h1>
        <button
          onClick={handleAddMemberClick}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserPlus size={20} />
          <span>Add Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Mail size={16} />
                <span className="text-sm">{member.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Phone size={16} />
                <span className="text-sm">{member.phone}</span>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => handleEditMemberClick(member)}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDeleteMember(member.id)}
                className="p-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <TeamMemberFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveMember}
        initialData={editingMember}
      />
    </div>
  );
};

export default Team; 