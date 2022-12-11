"""deletes

Revision ID: 4c37f7de847c
Revises: 81ac810d1e28
Create Date: 2022-05-07 17:55:20.166715

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4c37f7de847c'
down_revision = '81ac810d1e28'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('participation_task_id_fkey', 'participation', type_='foreignkey')
    op.create_foreign_key(None, 'participation', 'task', ['task_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'participation', type_='foreignkey')
    op.create_foreign_key('participation_task_id_fkey', 'participation', 'task', ['task_id'], ['id'])
    # ### end Alembic commands ###
