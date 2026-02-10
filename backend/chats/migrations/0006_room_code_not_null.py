from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0005_backfill_room_codes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatroom',
            name='room_code',
            field=models.CharField(editable=False, max_length=14, unique=True),
        ),
    ]
