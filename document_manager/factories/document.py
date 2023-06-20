import factory

from document_manager.models import Document


class DocumentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Document
